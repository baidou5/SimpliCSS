'use strict';
// Reproducible benchmark of SimpliCSS's compiler only; no competitor claims.
const {performance}=require('node:perf_hooks');
const {gzipSync}=require('node:zlib');
const {compile}=require('../lib/compiler.cjs');
const classes=['flex','flex-col','md:flex-row','grid','grid-cols-3','gap-4','p-6','m-2','bg-primary','text-2xl','shadow-md','rounded-lg','hover:bg-success','dark:text-ink','rtl:ms-4'];
const scales=[100,1000,10000];
const iterations=10;
const results=[];
for(const count of scales){
 const source=Array.from({length:count},(_,i)=>'<div class="'+classes.map((v,j)=>classes[(i+j)%classes.length]).join(' ')+'"></div>').join('\n');
 const samples=[];
 let result;
 for(let i=0;i<iterations+2;i++){
  const t=performance.now();result=compile({sources:[source]});const duration=performance.now()-t;
  if(i>=2)samples.push(duration);
 }
 samples.sort((a,b)=>a-b);
 results.push({elements:count,sourceKiB:+(Buffer.byteLength(source)/1024).toFixed(2),rules:result.generated,cssBytes:Buffer.byteLength(result.css),gzipBytes:gzipSync(result.css).length,medianMs:+((samples[4]+samples[5])/2).toFixed(3),p90Ms:+samples[8].toFixed(3)});
}
console.log(JSON.stringify({runtime:process.version,iterations,warmups:2,results},null,2));
