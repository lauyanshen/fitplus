import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../lib/fit-ai-client.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const endpoint = 'https://fit-plus-health.eddielau.chatgpt.site/api/ai';
function setup(url = endpoint, implementation = async () => Response.json({result:{answer:'Hello'}})) {
  const calls = [];
  const context = { exports: {}, process: { env: { NEXT_PUBLIC_FIT_AI_ENDPOINT: url } },
    AbortController, Response, TypeError, setTimeout, clearTimeout,
    window: { open() { throw new Error('A popup must never open'); } },
    fetch: async (...args) => { calls.push(args); return implementation(...args); } };
  vm.runInNewContext(compiled, context);
  return { request: context.exports.requestFitAI, calls };
}
const init = { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({kind:'assistant',question:'Suggest a snack'}) };
test('GitHub uses direct API calls for repeated questions without opening windows', async () => {
  const s=setup();
  for(let i=0;i<3;i++) assert.equal((await (await s.request(init)).json()).result.answer,'Hello');
  assert.equal(s.calls.length,3);
  assert.ok(s.calls.every(([url,options])=> url===endpoint && options.credentials==='omit' && options.redirect==='error'));
});
test('Sites retains the same-origin API endpoint', async () => {
  const s=setup(''); await s.request(init); assert.equal(s.calls[0][0],'/api/ai');
});
test('quota and paused responses are returned to the interface without retries', async () => {
  for(const status of [429,503]) {
    const s=setup(endpoint,async()=>Response.json({error:'Allowance reached'},{status}));
    const r=await s.request(init); assert.equal(r.status,status); assert.equal((await r.json()).error,'Allowance reached'); assert.equal(s.calls.length,1);
  }
});
test('HTML sign-in responses cannot appear as successful AI answers', async()=> {
  const s=setup(endpoint,async()=>new Response('<html>Sign in</html>',{headers:{'Content-Type':'text/html'}}));
  await assert.rejects(s.request(init),/connection is unavailable/);
});
test('network failures reset the pending state and permit an explicit next attempt',async()=> {
  const s=setup(endpoint,async()=>{throw new TypeError('Failed to fetch');});
  await assert.rejects(s.request(init),/internet connection/); await assert.rejects(s.request(init),/internet connection/); assert.equal(s.calls.length,2);
});
test('a second simultaneous click cannot create another billed request',async()=> {
  let release; const s=setup(endpoint,()=>new Promise(r=>release=r));
  const first=s.request(init); await assert.rejects(s.request(init),/finish your current/);
  release(Response.json({result:{answer:'Hello'}})); await first; assert.equal(s.calls.length,1);
});
test('caller cancellation is forwarded and cleaned up',async()=> {
  const s=setup(endpoint,(_,options)=>new Promise((resolve,reject)=> options.signal.addEventListener('abort',()=>reject(new Error('aborted')))));
  const c=new AbortController(); const p=s.request({...init,signal:c.signal}); c.abort(); await assert.rejects(p,/cancelled/);
});
