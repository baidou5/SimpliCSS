'use strict';
/* All comparisons use a canonical page and separately translated class names.
 * Measure CSS build and transfer size, not browser render performance. */
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),os=require('node:os');
const {performance}=require('node:perf_hooks');
const {execFileSync}=require('node:child_process');
const {compile}=require('../lib/compiler.cjs');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(__dirname,'fixture.html'),'utf8');
const output=[];
function record(name,css,ms){const bytes=Buffer.from(css);output.push({framework:name,buildMs:+ms.toFixed(3),cssBytes:bytes.length,gzipBytes:zlib.gzipSync(bytes).length});}
const t0=performance.now();record('SimpliCSS compiler',compile({sources:[html]}).css,performance.now()-t0);
function compare(name,packageName,cli,args,cssFile,transform){
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'sc-compare-'));
 try{
  const content=transform(html);
  fs.writeFileSync(path.join(temp,'page.html'),content);
  fs.writeFileSync(path.join(temp,'input.css'),name==='Tailwind'?'@import "tailwindcss";':'');
  const start=performance.now();
  execFileSync(process.execPath,[require.resolve(cli),...args(temp)],{cwd:root,timeout:120000,stdio:'pipe'});
  const ms=performance.now()-start;
  record(name,fs.readFileSync(cssFile(temp),'utf8'),ms);
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
const translations={
 'bg-primary':{Tailwind:'bg-blue-600',Bootstrap:'bg-primary'},
 'text-surface':{Tailwind:'text-white',Bootstrap:'text-white'},
 'bg-surface':{Tailwind:'bg-white',Bootstrap:'bg-white'},
 'text-ink':{Tailwind:'text-slate-900',Bootstrap:'text-dark'},
 'rounded-md':{Tailwind:'rounded-md',Bootstrap:'rounded'},
 'rounded-lg':{Tailwind:'rounded-lg',Bootstrap:'rounded-3'},
 'shadow-md':{Tailwind:'shadow-md',Bootstrap:'shadow'},
 'text-2xl':{Tailwind:'text-2xl',Bootstrap:'fs-4'},
 'text-sm':{Tailwind:'text-sm',Bootstrap:'small'},
 'grid-cols-3':{Tailwind:'grid-cols-3',Bootstrap:'row row-cols-3'},
 'gap-4':{Tailwind:'gap-4',Bootstrap:'g-3'},
 'p-6':{Tailwind:'p-6',Bootstrap:'p-4'},
 'p-4':{Tailwind:'p-4',Bootstrap:'p-3'},
 'p-2':{Tailwind:'p-2',Bootstrap:'p-2'},
 'justify-between':{Tailwind:'justify-between',Bootstrap:'justify-content-between'},
 'justify-center':{Tailwind:'justify-center',Bootstrap:'justify-content-center'},
 'items-center':{Tailwind:'items-center',Bootstrap:'align-items-center'},
 'hover:bg-success':{Tailwind:'hover:bg-green-600',Bootstrap:'bg-success'}
};
function mapped(html,framework){return html.replace(/class="([^"]*)"/g,(_,classes)=>'class="'+classes.split(/\s+/).map(c=>translations[c]?.[framework]||c).join(' ')+'"')}
try{
 compare('Tailwind','@tailwindcss/cli','@tailwindcss/cli',dir=>['-i',path.join(dir,'input.css'),'-o',path.join(dir,'out.css'),'-m'],dir=>path.join(dir,'out.css'),x=>mapped(x,'Tailwind'));
}catch(e){output.push({framework:'Tailwind',error:'Install optional benchmark deps / CLI: '+e.message.split('\n')[0]})}
try{
 const css=require.resolve('bootstrap/dist/css/bootstrap.min.css');
 record('Bootstrap bundled CSS',fs.readFileSync(css,'utf8'),0);
}catch(e){output.push({framework:'Bootstrap bundled CSS',error:'Install bootstrap benchmark dependency'})}
console.log(JSON.stringify({note:'Exploratory baseline; not feature-parity or browser benchmark',runtime:process.version,results:output},null,2));
