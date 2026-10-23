const {test}=require('node:test');
const assert=require('node:assert/strict');
const {compile,extractClasses,parseToken,makeTheme}=require('../lib/compiler.cjs');
test('extracts literal class and className attributes',()=>{
 assert.deepEqual([...extractClasses('<div class="flex gap-4"><p className="md:grid-cols-3">')],['flex','gap-4','md:grid-cols-3']);
});
test('generates responsive states and dark/rtl selectors',()=>{
 const r=compile({sources:['<p class="flex md:grid-cols-3 hover:bg-primary dark:text-ink rtl:ms-4">']});
 assert.equal(r.generated,5);assert.match(r.css,/@media \(min-width:768px\)/);
 assert.match(r.css,/hover\\:bg-primary:hover/);assert.match(r.css,/data-theme="dark"/);
 assert.match(r.css,/dir="rtl"/);
});
test('supports user-defined theme',()=>{
 const r=compile({safelist:['bg-brand','p-7'],theme:{colors:{brand:'#abc123'},spacing:{7:'1.75rem'}}});
 assert.equal(r.generated,2);assert.match(r.css,/--sc-brand:#abc123/);assert.match(r.css,/padding:1.75rem/);
});
test('rejects malformed tokens',()=>{
 assert.equal(parseToken('hover:fake',makeTheme()),null);
 assert.deepEqual(compile({safelist:['unknown-class']}).unknown,['unknown-class']);
 assert.throws(()=>compile({theme:{colors:{bad:'red;} .x{display:none'}}}),/Invalid/);
});
test('supports fractions and grid columns',()=>{
 const r=compile({safelist:['w-1/2','grid-cols-12']});
 assert.match(r.css,/width:50%/);assert.match(r.css,/repeat\(12,minmax\(0,1fr\)\)/);
});
