'use strict';
const fs=require('node:fs'),zlib=require('node:zlib');
const limits={
 'dist/SimpliCSS.css':{raw:20000,gzip:6000},
 'dist/simplicss-ui.css':{raw:12000,gzip:4000},
 'dist/simplicss-interactions.css':{raw:8000,gzip:3000}
};
let failed=false;
for(const [file,limit] of Object.entries(limits)){
 if(!fs.existsSync(file)){console.error('MISSING '+file);failed=true;continue;}
 const data=fs.readFileSync(file),gzip=zlib.gzipSync(data,{level:9});
 const ok=data.byteLength<=limit.raw&&gzip.byteLength<=limit.gzip;
 console.log(JSON.stringify({file,bytes:data.byteLength,gzipBytes:gzip.byteLength,budgetBytes:limit.raw,budgetGzipBytes:limit.gzip,pass:ok}));
 if(!ok)failed=true;
}
if(failed)process.exitCode=1;
