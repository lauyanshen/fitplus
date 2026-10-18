import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import ts from "typescript";

const url = "https://fit-plus-health.eddielau.chatgpt.site/ai-connect";
const origin = new URL(url).origin;
const source = readFileSync(new URL("../lib/fit-ai-client.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function setup(connectionURL = url, popupAllowed = true) {
  const messages = [], handlers = new Set(), intervals = new Map(), timeouts = new Map(), fetches = [];
  let timerID = 0;
  const child = { closed: false, postMessage: (data, target) => messages.push({data,target}) };
  const window = {
    open: () => popupAllowed ? child : null,
    addEventListener: (type, handler) => handlers.add(handler),
    removeEventListener: (type, handler) => handlers.delete(handler),
    setInterval: fn => { intervals.set(++timerID, fn); return timerID; },
    clearInterval: id => intervals.delete(id),
    setTimeout: fn => { timeouts.set(++timerID, fn); return timerID; },
    clearTimeout: id => timeouts.delete(id),
  };
  const context = { exports: {}, process: { env: { NEXT_PUBLIC_FIT_AI_CONNECTION: connectionURL } }, window, crypto: { randomUUID: () => "12345678-abcd-1234-abcd-123456789012" }, URL, Response, fetch: async (...args) => { fetches.push(args); return new Response('{}'); } };
  vm.runInNewContext(compiled, context);
  const send = (data, eventOrigin = origin, eventSource = child) => { for (const handler of [...handlers]) handler({ data, origin: eventOrigin, source: eventSource }); };
  return { request: context.exports.requestFitAI, child, messages, handlers, intervals, timeouts, fetches, send };
}
const request = { method: 'POST', body: JSON.stringify({kind:'calories', food:'one apple'}) };

test('Sites version retains its original same-origin endpoint', async () => {
  const s = setup(''); await s.request(request);
  assert.equal(s.fetches[0][0], '/api/ai'); assert.equal(s.messages.length,0);
});
test('blocked connection window returns a useful error', async () => {
  await assert.rejects(setup(url,false).request(request), /allow the Fit\+ connection window/);
});
test('wrong origin and wrong window cannot receive a food request', async () => {
  const s=setup(); const pending=s.request(request);
  s.send({type:'fitplus:ready'},'https://example.com');
  s.send({type:'fitplus:ready'},origin,{});
  assert.equal(s.messages.length,0);
  s.send({type:'fitplus:ready'});
  assert.equal(s.messages.length,1); assert.equal(s.messages[0].target,origin);
  assert.equal(s.messages[0].data.payload.food,'one apple');
  s.send({type:'fitplus:response',id:s.messages[0].data.id,status:200,data:{result:{items:[]}}});
  const response=await pending; assert.equal(response.status,200);
  assert.equal(s.handlers.size,0); assert.equal(s.intervals.size,0); assert.equal(s.timeouts.size,0);
});
test('repeated ready messages never duplicate a paid API request', async () => {
  const s=setup(); const pending=s.request(request); s.send({type:'fitplus:ready'}); s.send({type:'fitplus:ready'});
  assert.equal(s.messages.length,1);
  s.send({type:'fitplus:response',id:s.messages[0].data.id,status:503,data:{error:'unavailable'}});
  assert.equal((await pending).status,503);
});
test('unrelated responses do not complete the current request', async () => {
  const s=setup(); const pending=s.request(request); s.send({type:'fitplus:ready'});
  s.send({type:'fitplus:response',id:'wrong-id',status:200,data:{}});
  assert.equal(s.handlers.size,1);
  s.send({type:'fitplus:response',id:s.messages[0].data.id,status:200,data:{result:{answer:'hello'}}});
  assert.equal((await(await pending).json()).result.answer,'hello');
});
test('a second concurrent request cannot replace the connection window', async () => {
  const s=setup(); const pending=s.request(request); await assert.rejects(s.request(request),/finish your current/);
  s.send({type:'fitplus:ready'}); s.send({type:'fitplus:response',id:s.messages[0].data.id,status:200,data:{}}); await pending;
});
test('closing the connection cleans up pending timers and listeners', async () => {
  const s=setup(); const pending=s.request(request); s.child.closed=true;
  for(const fn of [...s.intervals.values()]) fn();
  await assert.rejects(pending,/window was closed/); assert.equal(s.handlers.size,0);
});
test('connection timeout is reported and cleaned up', async () => {
  const s=setup(); const pending=s.request(request);
  for(const fn of [...s.timeouts.values()]) fn();
  await assert.rejects(pending,/timed out/); assert.equal(s.handlers.size,0);
});
