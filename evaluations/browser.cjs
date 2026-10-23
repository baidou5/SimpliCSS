#!/usr/bin/env node
'use strict';
// Optional real-browser checks. Install playwright and browsers separately.
const fs=require('node:fs'),path=require('node:path');
async function evaluateBrowser(html,{browserType='chromium'}={}){
 const {chromium,firefox,webkit}=require('playwright');
 const browserEngine={chromium,firefox,webkit}[browserType];
 if(!browserEngine)throw Error('Unknown browser engine');
 const browser=await browserEngine.launch({headless:true});
 try{
  const page=await browser.newPage();
  await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
  const checks=await page.evaluate(()=>{
   const inputs=[...document.querySelectorAll('input,select,textarea')];
   const buttons=[...document.querySelectorAll('button')];
   const labels=inputs.every(input=>!!(input.labels&&input.labels.length)||!!input.getAttribute('aria-label'));
   const namedButtons=buttons.every(btn=>!!(btn.textContent||'').trim()||!!btn.getAttribute('aria-label'));
   const duplicateIds=[...document.querySelectorAll('[id]')].map(x=>x.id);
   const distinctIds=duplicateIds.length===new Set(duplicateIds).size;
   const imagesNamed=[...document.images].every(img=>img.hasAttribute('alt'));
   return {labeledFormControls:labels,namedButtons,uniqueIds:distinctIds,imagesHaveAlt:imagesNamed};
  });
  return {browser:browserType,passed:Object.values(checks).every(Boolean),checks};
 }finally{await browser.close()}
}
if(require.main===module){
 const file=process.argv[2],engine=process.argv[3]||'chromium';
 if(!file){console.error('Usage: node evaluations/browser.cjs <html-file> [chromium|firefox|webkit]');process.exitCode=1}
 else evaluateBrowser(fs.readFileSync(path.resolve(file),'utf8'),{browserType:engine}).then(r=>{console.log(JSON.stringify(r,null,2));if(!r.passed)process.exitCode=2}).catch(e=>{console.error('Browser evaluation: '+e.message);process.exitCode=1});
}
module.exports={evaluateBrowser};
