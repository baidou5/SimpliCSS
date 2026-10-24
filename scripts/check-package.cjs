#!/usr/bin/env node
'use strict';
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const required=['package.json','LICENSE','README.md','index.cjs','lib/compiler.cjs','lib/engine3.cjs','lib/ai-native.cjs','lib/component-registry.cjs','bin/simplicss.cjs','bin/simplicss-mcp.cjs','dist/SimpliCSS.css','dist/simplicss-ui.css','AGENTS.md','AI_INTEGRATION.md'];
try {
 const raw=execFileSync(process.platform==='win32'?'npm.cmd':'npm',['pack','--dry-run','--json','--ignore-scripts'],{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024});
 const pkg=JSON.parse(raw)[0];
 const included=new Set(pkg.files.map(f=>f.path));
 const absent=required.filter(file=>!included.has(file));
 if(absent.length)throw Error('Missing from tarball: '+absent.join(', '));
 const expected=require('../package.json');
 if(expected.license!=='MIT')throw Error('License metadata must match MIT');
 if(pkg.name!==expected.name||pkg.version!==expected.version)throw Error('Package identity mismatch');
 console.log(JSON.stringify({name:pkg.name,version:pkg.version,packedBytes:pkg.size,requiredFilesChecked:required.length,pass:true}));
} catch(e){console.error('Package check failed: '+e.message);process.exitCode=1}
