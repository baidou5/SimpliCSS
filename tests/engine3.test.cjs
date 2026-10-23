'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {compile,extractClasses,parseToken,makeTheme}=require('../lib/compiler.cjs');

test('Engine 3 scans static HTML and JSX string literals',()=>{
 const html='<div class="flex w-[320px]"></div><p className={"md:hover:bg-[#123456]"}></p>';
 assert.deepEqual([...extractClasses(html)],['flex','w-[320px]','md:hover:bg-[#123456]']);
});
test('dynamic Vue and JSX expressions are not guessed',()=>{
 assert.deepEqual([...extractClasses('<p :class="isReady ? green : red" className={dynamic} class="grid">')],['grid']);
});
test('arbitrary width, color, spacing and grid tracks',()=>{
 const result=compile({safelist:['w-[320px]','bg-[#0f172a]','p-[1.5rem]','grid-cols-[200px_1fr]']});
 assert.equal(result.generated,4);assert.deepEqual(result.unknown,[]);
 for(const declaration of ['width:320px','background-color:#0f172a','padding:1.5rem','grid-template-columns:200px 1fr'])
  assert.ok(result.css.includes(declaration),declaration);
});
test('arbitrary calc() allows underscores in place of spaces',()=>{
 const css=parseToken('w-[calc(100%_-_2rem)]',makeTheme());
 assert.ok(css.includes('width:calc(100% - 2rem)'));
});
test('responsive, state, dark and RTL variants compose',()=>{
 const css=parseToken('md:dark:rtl:hover:bg-[#111111]',makeTheme());
 assert.ok(css.includes('@media (min-width:768px)'));
 assert.ok(css.includes('[dir="rtl"]'));
 assert.ok(css.includes('[data-theme="dark"]'));
 assert.ok(css.includes(':hover{background-color:#111111}'));
});
test('group and peer variants are generated',()=>{
 const t=makeTheme();
 assert.ok(parseToken('group-hover:focus:flex',t).includes('.group:hover '));
 assert.ok(parseToken('peer-checked:flex',t).includes('.peer:checked ~ '));
});
test('legacy utility names remain valid',()=>{
 const r=compile({safelist:['flex','bg-primary','text-2xl','shadow-md','w-1/2','gap-4']});
 assert.equal(r.generated,6);assert.deepEqual(r.unknown,[]);
});
test('malformed and unsafe values are rejected',()=>{
 const bad=['w-[url(evil)]','w-[calc(1px_+_2px);color:red]','w-[1px','w-[1px]]',
 'unknown:w-[2px]','sm:md:flex','rtl:ltr:flex','hover:hover:flex','bg-[<svg>]'];
 for(const token of bad)assert.equal(parseToken(token,makeTheme()),null,token);
});
test('unknown utility is reported without throwing',()=>{
 assert.deepEqual(compile({safelist:['nonexistent-thing']}).unknown,['nonexistent-thing']);
});

test('typed arbitrary text and border lengths are not color properties',()=>{
 const r=compile({safelist:['text-[18px]','text-[clamp(1rem,2vw,2rem)]','border-[2px]','text-[#ffffff]']});
 assert.equal(r.generated,4);
 assert.ok(r.css.includes('font-size:18px'));
 assert.ok(r.css.includes('font-size:clamp(1rem,2vw,2rem)'));
 assert.ok(r.css.includes('border-width:2px'));
 assert.ok(r.css.includes('color:#ffffff'));
});
test('dark and direction on the same ancestor remain matchable',()=>{
 const css=parseToken('dark:rtl:bg-[#222222]',makeTheme());
 assert.ok(css.includes('[dir="rtl"].dark '));
 assert.ok(css.includes('[dir="rtl"][data-theme="dark"] '));
});
