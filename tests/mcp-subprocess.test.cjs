'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const server=path.resolve(__dirname,'../bin/simplicss-mcp.cjs');
function request(id,method,params){return JSON.stringify({jsonrpc:'2.0',id,method,...(params?{params}:{})})}
test('real MCP child process supports initialize, tool discovery, validation and rendering',()=>{
 const payload=[
  request(1,'initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'smoke',version:'1'}}),
  JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'}),
  request(2,'tools/list'),
  request(3,'tools/call',{name:'simplicss_manifest',arguments:{}}),
  request(4,'tools/call',{name:'simplicss_validate',arguments:{classes:['flex','invalid-class']}}),
  request(5,'tools/call',{name:'simplicss_render',arguments:{name:'button',props:{label:'Save'}}}),
  request(6,'tools/call',{name:'simplicss_compile',arguments:{classes:['p-4']}})
 ].join('\n')+'\n';
 const run=spawnSync(process.execPath,[server],{input:payload,encoding:'utf8',timeout:10000,maxBuffer:1024*1024});
 assert.equal(run.status,0,run.stderr);
 assert.equal(run.stderr,'');
 const responses=run.stdout.trim().split('\n').map(JSON.parse);
 assert.deepEqual(responses.map(x=>x.id),[1,2,3,4,5,6]);
 assert.ok(responses[0].result.capabilities.tools);
 assert.ok(responses[1].result.tools.some(t=>t.name==='simplicss_validate'));
 assert.equal(JSON.parse(responses[2].result.content[0].text).engine,'SimpliCSS 3');
 assert.equal(JSON.parse(responses[3].result.content[0].text).valid,false);
 assert.ok(JSON.parse(responses[4].result.content[0].text).html.includes('<button'));
 assert.ok(JSON.parse(responses[5].result.content[0].text).css.includes('padding:1rem'));
});
test('MCP child process reports unknown tool as tool error',()=>{
 const run=spawnSync(process.execPath,[server],{input:request(1,'tools/call',{name:'missing',arguments:{}})+'\n',encoding:'utf8',timeout:10000});
 assert.equal(run.status,0);
 assert.equal(JSON.parse(run.stdout.trim()).result.isError,true);
});
