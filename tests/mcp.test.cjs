const test=require('node:test'),assert=require('node:assert/strict');
const {PassThrough}=require('node:stream');
const {handle,start}=require('../bin/simplicss-mcp.cjs');
test('MCP initializes and exposes tools',()=>{
 const init=handle({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26'}});
 assert.equal(init.result.serverInfo.name,'simplicss-ai-bridge');
 const listed=handle({jsonrpc:'2.0',id:2,method:'tools/list'});
 assert.ok(listed.result.tools.some(t=>t.name==='simplicss_render'));
});
test('MCP validates classes and renders safe HTML',()=>{
 const validate=handle({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'simplicss_validate',arguments:{classes:['flex','fake-class']}}});
 const diagnostic=JSON.parse(validate.result.content[0].text);
 assert.equal(diagnostic.valid,false);
 const render=handle({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'simplicss_render',arguments:{name:'button',props:{label:'<script>'}}}});
 assert.equal(render.result.isError,false);
 assert.ok(JSON.parse(render.result.content[0].text).html.includes('&lt;script&gt;'));
});
test('MCP reports tool errors without crashing',()=>{
 const r=handle({jsonrpc:'2.0',id:9,method:'tools/call',params:{name:'simplicss_render',arguments:{name:'button',props:{}}}});
 assert.equal(r.result.isError,true);
});
test('MCP uses newline-delimited JSON over stdio',()=>{
 const input=new PassThrough(),output=new PassThrough();
 let response='';output.on('data',x=>response+=x.toString());
 start(input,output);
 input.write(JSON.stringify({jsonrpc:'2.0',id:1,method:'ping'})+'\n');
 assert.equal(JSON.parse(response.trim()).id,1);
 input.destroy();output.destroy();
});
