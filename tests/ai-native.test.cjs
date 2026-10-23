const test=require('node:test'),assert=require('node:assert/strict');
const {manifest,validate}=require('../lib/ai-native.cjs');
test('manifest exposes real configured tokens and variants',()=>{
 const m=manifest({theme:{colors:{brand:'#123456'}}});
 assert.equal(m.schemaVersion,'1.0');
 assert.equal(m.tokens.colors.brand,'#123456');
 assert.ok(m.capabilities.variants.includes('dark'));
 assert.ok(m.capabilities.arbitraryPrefixes.includes('w'));
});
test('validator reports unknown classes with diagnostics',()=>{
 const r=validate({classes:['flex','w-[320px]','bg-primari']});
 assert.equal(r.checked,3);assert.equal(r.valid,false);
 assert.deepEqual(r.validClasses,['flex','w-[320px]']);
 assert.equal(r.diagnostics[0].className,'bg-primari');
 assert.ok(r.diagnostics[0].suggestions.includes('bg-primary'));
});
test('validator uses conservative source extraction',()=>{
 const r=validate({sources:['<div class="grid gap-4" :class="unknown"></div>']});
 assert.equal(r.valid,true);assert.equal(r.checked,2);
});
test('validator rejects unsafe arbitrary values',()=>{
 const r=validate({classes:['bg-[url(evil)]']});
 assert.equal(r.valid,false);assert.equal(r.diagnostics[0].code,'UNKNOWN_CLASS');
});
test('validator handles custom color tokens',()=>{
 const r=validate({classes:['bg-brand'],theme:{colors:{brand:'#334455'}}});
 assert.equal(r.valid,true);
});
