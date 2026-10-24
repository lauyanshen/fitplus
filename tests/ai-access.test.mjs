import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import ts from 'typescript';
function compile(path, context) {
  const code=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,context);return context.exports;
}
const access=compile('../lib/ai-access.ts',{exports:{},TextEncoder,crypto:webcrypto});
function database(){
  const sql=new DatabaseSync(':memory:');
  sql.exec(readFileSync(new URL('../drizzle/0000_woozy_proudstar.sql',import.meta.url),'utf8'));
  return {sql,prepare(query){return {bind(...values){return {async first(){return sql.prepare(query).get(...values)||null;},async run(){return sql.prepare(query).run(...values);}};}};}};
}
test('atomic lifetime allowance rejects excess concurrent requests',async()=>{
  const db=database();
  const results=await Promise.all(Array.from({length:325},(_,i)=>access.reserveAiRequest(db,`client-${i}`,0)));
  assert.equal(results.filter(x=>x===null).length,300);
  assert.equal((await access.aiStatus(db)).used,300);
  assert.ok(results.filter(Boolean).every(x=>x.status===429));
  assert.equal((await access.reserveAiRequest(db,'new-client',86400000)).status,429,'allowance does not reset on the next day');
});
test('minute and hourly rate limits are enforced independently',async()=>{
  const db=database();
  for(let i=0;i<12;i++) assert.equal(await access.reserveAiRequest(db,'one-network',0),null);
  assert.equal((await access.reserveAiRequest(db,'one-network',0)).status,429);
  assert.equal(await access.reserveAiRequest(db,'one-network',60000),null);
  for(let minute=2;minute<120;minute++) await access.reserveAiRequest(db,'one-network',minute%60*60000);
  assert.equal((await access.aiStatus(db)).used,120);
  assert.equal((await access.reserveAiRequest(db,'one-network',59*60000)).status,429);
  assert.equal(await access.reserveAiRequest(db,'one-network',3600000),null);
});
test('owner pause persists and consumes no extra allowance',async()=>{
  const db=database();
  await db.prepare('INSERT INTO ai_settings (key,value) VALUES (?,?)').bind('enabled','false').run();
  const r=await access.reserveAiRequest(db,'client',0);assert.equal(r.status,503);
  assert.equal((await access.aiStatus(db)).used,0);
});
test('client addresses are hashed before counters are stored',async()=>{
  const hash=await access.hashClient('192.0.2.1');assert.match(hash,/^[a-f0-9]{64}$/);assert.ok(!hash.includes('192.0.2.1'));
});

function routeSetup(){
  const db=database();let calls=0;
  class JsonResponse extends Response {static json(body,options){return Response.json(body,options);}}
  const context={exports:{},process:{env:{OPENAI_API_KEY:'test-placeholder'}},Response,AbortSignal,Uint8Array,TextDecoder,TextEncoder,console,
    fetch:async()=>{calls++;return Response.json({output:[{content:[{type:'output_text',text:'{"answer":"Try a short walk."}'}]}]});},
    require:(name)=>name==='next/server'?{NextResponse:JsonResponse}:name==='cloudflare:workers'?{env:{DB:db}}:access};
  return {api:compile('../app/api/ai/route.ts',context),db,calls:()=>calls,context};
}
const origin='https://lauyanshen.github.io';
const request=(body={kind:'assistant',question:'Suggest an activity'},headerOrigin=origin)=>new Request('https://fit-plus-health.eddielau.chatgpt.site/api/ai',{method:'POST',headers:{Origin:headerOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('allowed preflight works without login, unrelated origins are rejected',()=>{
  const {api}=routeSetup();
  const r=api.OPTIONS(new Request('https://example.com/api/ai',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}}));
  assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);
  assert.equal(api.OPTIONS(new Request('https://example.com/api/ai',{method:'OPTIONS',headers:{Origin:'https://evil.example'}})).status,403);
});
test('successful requests return JSON and CORS without redirects',async()=>{
  const {api,calls}=routeSetup();const r=await api.POST(request());assert.equal(r.status,200);assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);assert.equal((await r.json()).result.answer,'Try a short walk.');assert.equal(calls(),1);
});
test('malformed, oversized and wrong-origin requests never call OpenAI',async()=>{
  const {api,calls}=routeSetup();
  assert.equal((await api.POST(request({},'https://evil.example'))).status,403);
  assert.equal((await api.POST(request({kind:'assistant',question:'x'.repeat(21000)}))).status,413);
  assert.equal((await api.POST(request({kind:'assistant'}))).status,400);
  assert.equal((await api.POST(request({kind:'food_photo',image:'not-an-image'}))).status,400);
  const r=await api.POST(new Request('https://example.com/api/ai',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{'}));
  assert.equal(r.status,400);assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);assert.equal(calls(),0);
});
test('paused and exhausted states return readable errors with CORS and no AI call',async()=>{
  const {api,db,calls}=routeSetup();
  await db.prepare('INSERT INTO ai_settings (key,value) VALUES (?,?)').bind('enabled','false').run();
  let r=await api.POST(request());assert.equal(r.status,503);assert.equal(r.headers.get('Access-Control-Allow-Origin'),origin);
  db.sql.exec("UPDATE ai_settings SET value='true'; INSERT INTO ai_usage (key,count) VALUES ('exhibition-total',300);");
  r=await api.POST(request());assert.equal(r.status,429);assert.equal(calls(),0);
});

test('only the signed-in owner can read usage or pause AI; cross-origin writes fail',async()=>{
  const db=database();let user=null;
  const context={exports:{},process:{env:{FIT_ADMIN_EMAIL:'owner@example.com'}},Response,
    require:name=> name==='next/server'?{NextResponse:{json:Response.json.bind(Response)}}:
      name==='cloudflare:workers'?{env:{DB:db}}:
      name.includes('chatgpt-auth')?{getChatGPTUser:async()=>user}:access};
  const api=compile('../app/api/ai-control/route.ts',context);
  assert.equal((await api.GET()).status,403);
  user={email:'visitor@example.com'};assert.equal((await api.GET()).status,403);
  user={email:'owner@example.com'};assert.equal((await api.GET()).status,200);
  const make=origin=>new Request('https://fit-plus-health.eddielau.chatgpt.site/api/ai-control',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({enabled:false})});
  assert.equal((await api.POST(make('https://lauyanshen.github.io'))).status,403);
  assert.equal((await api.POST(make('https://fit-plus-health.eddielau.chatgpt.site'))).status,200);
  assert.equal((await access.aiStatus(db)).enabled,false);
});
