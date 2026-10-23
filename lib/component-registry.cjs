'use strict';
// AI-readable component definitions, restricted to audited semantic HTML templates.
const components=Object.freeze({
 button:{name:'button',description:'Accessible native button',css:['sc-btn','sc-btn-primary','sc-btn-secondary','sc-btn-outline'],props:{label:{type:'string',required:true,maxLength:120},variant:{type:'enum',values:['primary','secondary','outline'],default:'primary'},type:{type:'enum',values:['button','submit','reset'],default:'button'},disabled:{type:'boolean',default:false}},a11y:['Use a descriptive label','Native disabled state'],interactive:false},
 card:{name:'card',description:'Semantic content card',css:['sc-card','sc-card-header','sc-card-body'],props:{title:{type:'string',required:true,maxLength:120},body:{type:'string',required:true,maxLength:3000}},a11y:['Uses article landmark and heading'],interactive:false},
 input:{name:'input',description:'Labeled native text input',css:['sc-label','sc-input'],props:{label:{type:'string',required:true,maxLength:120},name:{type:'identifier',required:true},type:{type:'enum',values:['text','email','search','tel','url','password'],default:'text'},placeholder:{type:'string',default:'',maxLength:200},required:{type:'boolean',default:false}},a11y:['Label is associated with input','Input name is required'],interactive:false},
 alert:{name:'alert',description:'Informational or error alert',css:['sc-alert','sc-alert-danger'],props:{message:{type:'string',required:true,maxLength:1000},tone:{type:'enum',values:['info','danger'],default:'info'}},a11y:['Uses role alert only for urgent error state'],interactive:false}
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function listComponents(){return Object.values(components).map(x=>structuredClone(x))}
function getComponent(name){return Object.hasOwn(components,name)?structuredClone(components[name]):null}
function renderComponent(name,props={}){
 const definition=components[name];
 if(!definition)throw new Error('Unknown component: '+name);
 if(!props||typeof props!=='object'||Array.isArray(props))throw new TypeError('props must be an object');
 const resolved={};
 for(const key of Object.keys(props))if(!Object.hasOwn(definition.props,key))throw new Error('Unknown prop: '+key);
 for(const [key,rule] of Object.entries(definition.props)){
  const value=Object.hasOwn(props,key)?props[key]:rule.default;
  if(value===undefined){if(rule.required)throw new Error('Missing required prop: '+key);continue}
  if(rule.type==='string'&&(typeof value!=='string'||value.length>(rule.maxLength||200)))throw new Error('Invalid prop: '+key);
  if(rule.type==='enum'&&!rule.values.includes(value))throw new Error('Invalid prop: '+key);
  if(rule.type==='boolean'&&typeof value!=='boolean')throw new Error('Invalid prop: '+key);
  if(rule.type==='identifier'&&(typeof value!=='string'||!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(value)))throw new Error('Invalid prop: '+key);
  resolved[key]=value;
 }
 const p=resolved;
 if(name==='button')return '<button type="'+p.type+'" class="sc-btn sc-btn-'+p.variant+'"'+(p.disabled?' disabled':'')+'>'+escapeHtml(p.label)+'</button>';
 if(name==='card')return '<article class="sc-card"><div class="sc-card-header"><h2>'+escapeHtml(p.title)+'</h2></div><div class="sc-card-body">'+escapeHtml(p.body)+'</div></article>';
 if(name==='input')return '<div><label class="sc-label" for="'+p.name+'">'+escapeHtml(p.label)+'</label><input class="sc-input" id="'+p.name+'" name="'+p.name+'" type="'+p.type+'" placeholder="'+escapeHtml(p.placeholder)+'"'+(p.required?' required':'')+'></div>';
 return '<div class="sc-alert'+(p.tone==='danger'?' sc-alert-danger':'')+'"'+(p.tone==='danger'?' role="alert"':'')+'>'+escapeHtml(p.message)+'</div>';
}
module.exports={listComponents,getComponent,renderComponent};
