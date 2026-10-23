#!/usr/bin/env node
'use strict';
// Minimal MCP JSON-RPC 2.0 server over stdio (newline-delimited JSON).
const {manifest,validate}=require('../lib/ai-native.cjs');
const {listComponents,getComponent,renderComponent}=require('../lib/component-registry.cjs');
const {compile}=require('../lib/compiler.cjs');
const tools=[
 {name:'simplicss_manifest',description:'Return supported SimpliCSS tokens, variants, utilities and components',inputSchema:{type:'object',properties:{theme:{type:'object',additionalProperties:true}},additionalProperties:false}},
 {name:'simplicss_validate',description:'Validate CSS utility classes and return structured diagnostics',inputSchema:{type:'object',properties:{classes:{type:'array',items:{type:'string'}},sources:{type:'array',items:{type:'string'}},theme:{type:'object'}},additionalProperties:false}},
 {name:'simplicss_components',description:'List available semantic UI components and their prop schemas',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'simplicss_component',description:'Retrieve a component definition',inputSchema:{type:'object',properties:{name:{type:'string'}},required:['name'],additionalProperties:false}},
 {name:'simplicss_render',description:'Render a safe semantic HTML component from validated props',inputSchema:{type:'object',properties:{name:{type:'string'},props:{type:'object'}},required:['name'],additionalProperties:false}},
 {name:'simplicss_compile',description:'Generate utility CSS from explicit sources/classes',inputSchema:{type:'object',properties:{sources:{type:'array',items:{type:'string'}},classes:{type:'array',items:{type:'string'}},theme:{type:'object'}},additionalProperties:false}}
];
function execute(name,args={}){
 switch(name){
  case 'simplicss_manifest':return manifest({theme:args.theme||{}});
  case 'simplicss_validate':return validate({classes:args.classes||[],sources:args.sources||[],theme:args.theme||{}});
  case 'simplicss_components':return listComponents();
  case 'simplicss_component':return getComponent(args.name);
  case 'simplicss_render':return {html:renderComponent(args.name,args.props||{})};
  case 'simplicss_compile':{
   if(args.classes!==undefined&&!Array.isArray(args.classes))throw Error('classes must be an array');
   if(args.sources!==undefined&&!Array.isArray(args.sources))throw Error('sources must be an array');
   if((args.classes||[]).some(x=>typeof x!=='string')||(args.sources||[]).some(x=>typeof x!=='string'))throw Error('Expected string arrays');
   return compile({sources:args.sources||[],safelist:args.classes||[],theme:args.theme||{}});
  }
  default:throw Error('Unknown tool: '+name);
 }
}
function handle(message){
 if(!message||message.jsonrpc!=='2.0'||typeof message.method!=='string')return {jsonrpc:'2.0',id:message?.id??null,error:{code:-32600,message:'Invalid Request'}};
 const id=message.id;
 try{
  let result;
  if(message.method==='initialize')result={protocolVersion:'2025-03-26',capabilities:{tools:{listChanged:false}},serverInfo:{name:'simplicss-ai-bridge',version:'0.1.0'}};
  else if(message.method==='notifications/initialized'||message.method==='ping'&&id===undefined)return null;
  else if(message.method==='ping')result={};
  else if(message.method==='tools/list')result={tools};
  else if(message.method==='tools/call'){
   const name=message.params?.name;
   const args=message.params?.arguments||{};
   try{result={content:[{type:'text',text:JSON.stringify(execute(name,args))}],isError:false}}
   catch(e){result={content:[{type:'text',text:String(e.message)}],isError:true}}
  }else{
   if(id===undefined)return null;
   return {jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}};
  }
  return id===undefined?null:{jsonrpc:'2.0',id,result};
 }catch(e){return id===undefined?null:{jsonrpc:'2.0',id,error:{code:-32603,message:e.message}}}
}
function start(input=process.stdin,output=process.stdout){
 // MCP stdio transport uses one JSON-RPC message per UTF-8 line.
 let pending='';
 input.setEncoding('utf8');
 input.on('data',chunk=>{
  pending+=chunk;
  if(pending.length>1048576){pending='';return}
  let cut;
  while((cut=pending.indexOf('\n'))!==-1){
   const line=pending.slice(0,cut).trim();pending=pending.slice(cut+1);
   if(!line)continue;
   let response;
   try{response=handle(JSON.parse(line))}
   catch(_){response={jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}}}
   if(response!==null)output.write(JSON.stringify(response)+'\n');
  }
 });
}
if(require.main===module)start();
module.exports={handle,start,execute,tools};
