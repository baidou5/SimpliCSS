#!/usr/bin/env node
'use strict';
const {build}=require('../lib/compiler.cjs');
try{
 const args=process.argv.slice(2);
 if(args.includes('--help')||args.includes('-h')){console.log('Usage: simplicss build [simplicss.config.json]');process.exit(0);}
 if(args[0]!=='build')throw Error('Use: simplicss build [config-file]');
 const out=build({configFile:args[1]||'simplicss.config.json'});
 console.log('Generated '+out.generated+' utility rules at '+out.output);
 if(out.unknown.length)console.warn('Unrecognized classes: '+out.unknown.join(', '));
}catch(e){console.error('SimpliCSS: '+e.message);process.exitCode=1;}
