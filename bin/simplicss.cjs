#!/usr/bin/env node
'use strict';
const {build}=require('../lib/compiler.cjs');
const {manifest,validate}=require('../lib/ai-native.cjs');
const fs=require('node:fs');
const {listComponents,getComponent,renderComponent}=require('../lib/component-registry.cjs');
try{
 const args=process.argv.slice(2);
 if(args.includes('--help')||args.includes('-h')){console.log('Usage: simplicss build [config.json] | manifest [config.json] | validate [config.json] | components | component <name> | render <name> <json-props>');process.exit(0);}
 if(!['build','manifest','validate','components','component','render'].includes(args[0]))throw Error('Use: simplicss build|manifest|validate|components|component|render');
 if(args[0]==='components')console.log(JSON.stringify(listComponents(),null,2));
 else if(args[0]==='component')console.log(JSON.stringify(getComponent(args[1]),null,2));
 else if(args[0]==='render')console.log(renderComponent(args[1],JSON.parse(args[2]||'{}')));
 else if(args[0]==='build'){
  const out=build({configFile:args[1]||'simplicss.config.json'});
  console.log('Generated '+out.generated+' utility rules at '+out.output);
  if(out.unknown.length)console.warn('Unrecognized classes: '+out.unknown.join(', '));
 }else{
  const configFile=args[1]||'simplicss.config.json';
  const config=fs.existsSync(configFile)?JSON.parse(fs.readFileSync(configFile,'utf8')):{};
  if(args[0]==='manifest')console.log(JSON.stringify(manifest({theme:config.theme||{}}),null,2));
  else{
   const {expandContentFiles}=require('../lib/compiler.cjs');
   const paths=config.content?expandContentFiles(process.cwd(),config.content):[];
   const result=validate({classes:config.safelist||[],sources:paths.map(p=>fs.readFileSync(p,'utf8')),theme:config.theme||{}});
   console.log(JSON.stringify(result,null,2));
   if(!result.valid)process.exitCode=2;
  }
 }
}catch(e){console.error('SimpliCSS: '+e.message);process.exitCode=1;}
