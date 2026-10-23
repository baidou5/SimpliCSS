const test=require('node:test'),assert=require('node:assert/strict');
const {score}=require('../evaluations/compare-frameworks.cjs');
test('no model submissions never become a claimed comparison',()=>{const r=score({entries:[]});assert.equal(r.eligible,false);assert.equal(r.errors.filter(x=>x.startsWith('Missing ')).length,9);});
test('duplicate submissions are rejected',()=>{const entry={framework:'simplicss',taskId:'dashboard',model:'test',modelVersion:'1',frameworkVersion:'1',attempt:1,temperature:0,html:'<main><nav></nav><button></button></main>'};assert.ok(score({entries:[entry,entry]}).errors.some(x=>x.startsWith('Duplicate')));});
test('different models invalidate same-task comparisons',()=>{const x=(framework,model)=>({framework,taskId:'dashboard',model,modelVersion:'1',frameworkVersion:'1',attempt:1,temperature:0,html:'<main></main>'});assert.ok(score({entries:[x('simplicss','a'),x('tailwind','b')]}).errors.some(x=>x.includes('Model versions differ')));});
