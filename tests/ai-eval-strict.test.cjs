const test=require('node:test'),assert=require('node:assert/strict');
const {run}=require('../evaluations/run.cjs');
test('strict evaluation never awards missing model outputs',()=>{
 const r=run({}, {strict:true});
 assert.equal(r.passed,0);
 assert.equal(r.submitted,0);
 assert.equal(r.total,6);
 assert.ok(r.results.every(x=>x.failures.includes('MISSING_SUBMISSION')));
});
test('strict evaluation counts only actual supplied answers',()=>{
 const r=run({'dashboard-utilities':{classes:['flex']}},{strict:true});
 assert.equal(r.submitted,1);
 assert.equal(r.passed,0);
 assert.equal(r.results.filter(x=>x.referenceFallback).length,5);
});
test('reference mode remains opt-in and passes fixture expectations',()=>{
 assert.equal(run().passed,6);
});
