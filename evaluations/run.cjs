#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {validate}=require('../lib/ai-native.cjs');
const {renderComponent}=require('../lib/component-registry.cjs');
const suite=JSON.parse(fs.readFileSync(path.join(__dirname,'tasks.json'),'utf8'));
function evaluate(task,submission){
 const failures=[],checks=[];
 function check(name,passed){checks.push({name,passed:!!passed});if(!passed)failures.push(name)}
 if(task.kind==='classes'){
  const classes=submission.classes;
  if(!Array.isArray(classes)||classes.some(x=>typeof x!=='string'))return {passed:false,checks:[],failures:['classes must be a string array']};
  const validation=validate({classes});
  check('all classes recognized',validation.valid);
  for(const name of task.required)check('required '+name,classes.includes(name));
 }else if(task.kind==='component'){
  // The baseline evaluates registry output; external AI submissions can provide HTML.
  const html=submission.html;
  if(typeof html!=='string')return {passed:false,checks:[],failures:['html must be a string']};
  for(const tag of task.requiredTags||[])check('tag '+tag,new RegExp('<'+tag+'(?:\\s|>)','i').test(html));
  for(const cls of task.requiredClasses||[])check('class '+cls,new RegExp('(?:^|[\\s"])'+cls+'(?:[\\s"])').test(html));
  for(const [key,value] of Object.entries(task.requiredAttributes||{}))check('attribute '+key,html.includes(key+'="'+value+'"'));
  check('contains no inline event handler',!/<[^>]+\son[a-z]+\s*=/i.test(html));
  check('contains no script element',!/<\s*script\b/i.test(html));
 }else throw new Error('Unknown task kind: '+task.kind);
 return {passed:failures.length===0,checks,failures};
}
function baselineSubmission(task){return task.kind==='classes'?{classes:task.required}:{html:renderComponent(task.component,task.props)}}
function run(submissions={}){
 const results=suite.tasks.map(task=>({id:task.id,kind:task.kind,...evaluate(task,submissions[task.id]||baselineSubmission(task))}));
 return {schemaVersion:suite.schemaVersion,source:Object.keys(submissions).length?'submitted-output-with-baseline-fallback':'simplicss-reference-baseline',total:results.length,passed:results.filter(x=>x.passed).length,results};
}
if(require.main===module){
 try{
  const file=process.argv[2],submissions=file?JSON.parse(fs.readFileSync(path.resolve(file),'utf8')):{};
  const report=run(submissions);
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
  if(report.passed!==report.total)process.exitCode=2;
 }catch(error){process.stderr.write('Evaluation: '+error.message+'\n');process.exitCode=1}
}
module.exports={evaluate,baselineSubmission,run};
