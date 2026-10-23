'use strict';
const {compile,makeTheme,parseToken}=require('./compiler.cjs');
const {extractClasses}=require('./engine3.cjs');
const variants=['hover','focus','focus-visible','active','disabled','checked','required','invalid','visited','first','last','odd','even','dark','rtl','ltr','group-hover','peer-checked'];
const families=[
 {prefix:'display',examples:['flex','grid','block','hidden']},
 {prefix:'spacing',examples:['p-4','px-2','m-2','gap-4']},
 {prefix:'color',examples:['bg-primary','text-ink','border-danger']},
 {prefix:'typography',examples:['text-2xl','font-bold']},
 {prefix:'layout',examples:['w-full','grid-cols-3','rounded-lg']},
 {prefix:'arbitrary',examples:['w-[320px]','bg-[#0f172a]','text-[18px]']}
];
function manifest({theme={}}={}){
 const t=makeTheme(theme);
 return {schemaVersion:'1.0',engine:'SimpliCSS 3',capabilities:{
  arbitraryValues:true,dynamicExpressions:false,staticHtmlAttributes:true,staticJsxLiterals:true,
  variants:[...Object.keys(t.screens),...variants],
  arbitraryPrefixes:['w','h','min-w','max-w','min-h','max-h','p','px','py','pt','pb','pl','pr','m','mx','my','mt','mb','ml','mr','gap','gap-x','gap-y','bg','text','border','rounded','grid-cols','opacity','z','leading','tracking','top','left','right','bottom','inset']
 },tokens:t,utilities:families,tools:['manifest','validate','build'],
 documentation:'ENGINE3.md'};
}
function distance(a,b){
 const m=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  let prev=m[0];m[0]=i;
  for(let j=1;j<=b.length;j++){const old=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=old;}
 }
 return m[b.length];
}
function suggest(token,t){
 const candidates=[
  'flex','grid','block','hidden','flex-col','flex-row','items-center','justify-between',
  'p-4','m-4','gap-4','w-full','rounded-lg','grid-cols-3',
  ...Object.keys(t.colors).flatMap(n=>['bg-'+n,'text-'+n,'border-'+n]),
  ...Object.keys(t.fontSizes).map(n=>'text-'+n),
  ...Object.keys(t.shadows).map(n=>'shadow-'+n),
  ...Object.keys(t.spacing).flatMap(n=>['p-'+n,'m-'+n,'gap-'+n])
 ];
 const found=[...new Set(candidates)].map(x=>({x,d:distance(token,x)})).filter(x=>x.d<=Math.max(2,Math.floor(token.length*.27))).sort((a,b)=>a.d-b.d||a.x.localeCompare(b.x)).slice(0,3);
 return found.map(x=>x.x);
}
function validate({classes=[],sources=[],theme={}}={}){
 if(!Array.isArray(classes)||!Array.isArray(sources)||classes.some(x=>typeof x!=='string')||sources.some(x=>typeof x!=='string'))throw new TypeError('classes and sources must be string arrays');
 const t=makeTheme(theme),tokens=new Set(classes);
 for(const source of sources)for(const token of extractClasses(source))tokens.add(token);
 const diagnostics=[],valid=[];
 for(const token of [...tokens].sort()){
  if(parseToken(token,t))valid.push(token);
  else diagnostics.push({className:token,code:'UNKNOWN_CLASS',severity:'error',message:'Unsupported or malformed SimpliCSS class',suggestions:suggest(token,t)});
 }
 return {valid:diagnostics.length===0,checked:tokens.size,validClasses:valid,diagnostics};
}
module.exports={manifest,validate};
