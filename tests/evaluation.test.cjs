const test=require('node:test'),assert=require('node:assert/strict');
const {run,evaluate}=require('../evaluations/run.cjs');
test('reference tasks pass deterministically',()=>{const r=run();assert.equal(r.total,6);assert.equal(r.passed,6);});
test('unknown class is reported',()=>{const r=evaluate({kind:'classes',required:['flex']},{classes:['flex','fake-utility']});assert.equal(r.passed,false);assert.ok(r.failures.includes('all classes recognized'));});
test('missing required utility is reported',()=>{const r=evaluate({kind:'classes',required:['flex','grid']},{classes:['flex']});assert.ok(r.failures.includes('required grid'));});
test('missing semantic input label is reported',()=>{const r=evaluate({kind:'component',requiredTags:['label','input'],requiredClasses:[],requiredAttributes:{}},{html:'<input>'});assert.equal(r.passed,false);});
test('inline event handlers fail safety check',()=>{const r=evaluate({kind:'component',requiredTags:['button'],requiredClasses:[],requiredAttributes:{}},{html:'<button onclick="attack()">Click</button>'});assert.equal(r.passed,false);});
