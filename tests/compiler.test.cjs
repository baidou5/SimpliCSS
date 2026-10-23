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

test('Blade, Vue and JSX static class extraction',()=>{
 const text='<div class="flex p-4">{{ $text }}</div><div :class="dark:bg-ink"></div><p className="md:flex-row">';
 const found=extractClasses(text);
 assert.ok(found.has('flex'));assert.ok(!found.has('dark:bg-ink'));assert.ok(found.has('md:flex-row'));
});
test('discovers project files using recursive content patterns',()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const {expandContentFiles,build}=require('../lib/compiler.cjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'simplicss-'));
 try{
  fs.mkdirSync(path.join(root,'resources','views'),{recursive:true});
  fs.mkdirSync(path.join(root,'node_modules'),{recursive:true});
  fs.writeFileSync(path.join(root,'resources','views','home.blade.php'),'<div class="flex gap-4"></div>');
  fs.writeFileSync(path.join(root,'node_modules','ignore.js'),'<p class="hidden">');
  fs.writeFileSync(path.join(root,'simplicss.config.json'),JSON.stringify({content:['resources/**/*.blade.php'],output:'dist/out.css'}));
  assert.equal(expandContentFiles(root,['resources/**/*.blade.php']).length,1);
  const result=build({cwd:root});
  assert.equal(result.filesScanned,1);assert.equal(result.generated,2);
  assert.match(fs.readFileSync(result.output,'utf8'),/display:flex/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('design tokens support font sizing, shadows and dark overrides',()=>{
 const result=compile({safelist:['text-2xl','shadow-md','bg-surface','dark:bg-surface'],theme:{darkColors:{surface:'#121212'}}});
 assert.equal(result.generated,4);
 assert.match(result.css,/--sc-font-2xl:1.5rem/);
 assert.match(result.css,/font-size:var\\(--sc-font-2xl\\)/);
 assert.match(result.css,/box-shadow:var\\(--sc-shadow-md\\)/);
 assert.match(result.css,/--sc-surface:#121212/);
});
test('dark and RTL combinations scope all selectors',()=>{
 const result=compile({safelist:['rtl:dark:bg-primary']});
 assert.match(result.css,/\\[dir="rtl"\\] \\.dark/);
 assert.match(result.css,/\\[dir="rtl"\\] \\[data-theme="dark"\\]/);
});
test('rejects dark overrides of unknown color keys',()=>{
 assert.throws(()=>compile({theme:{darkColors:{unknown:'red'}}}),/Invalid dark color/);
});

test('globs include only matching files and skip dependencies',()=>{
 const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
 const {expandContentFiles}=require('../lib/compiler.cjs');
 const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'sc-glob-'));
 try{
  for(const dir of ['resources/views/admin','resources/js','node_modules'])fs.mkdirSync(path.join(cwd,dir),{recursive:true});
  for(const file of ['resources/views/a.blade.php','resources/views/admin/b.blade.php','resources/js/app.js','node_modules/ignore.blade.php'])fs.writeFileSync(path.join(cwd,file),'test');
  const files=expandContentFiles(cwd,['resources/**/*.blade.php']).map(x=>path.relative(cwd,x));
  assert.deepEqual(files.sort(),['resources/views/a.blade.php','resources/views/admin/b.blade.php'].sort());
 }finally{fs.rmSync(cwd,{recursive:true,force:true})}
});
test('bound classes are not treated as safe static attributes',()=>{
 const {extractClasses}=require('../lib/compiler.cjs');
 const found=extractClasses('<div class="flex" :class="isActive ? green : red" v-bind:class="dynamic"></div>');
 assert.deepEqual([...found],['flex']);
});
