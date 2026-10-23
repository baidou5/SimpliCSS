#!/usr/bin/env node
'use strict';
// Fairness gate and reproducible structural metrics; no claims of equivalent CSS engines.
const fs=require('node:fs'),path=require('node:path');
const suite=JSON.parse(fs.readFileSync(path.join(__dirname,'comparison-tasks.json'),'utf8'));
function score(run){
 const errors=[],scores=[];
 if(!run||typeof run!=='object'||Array.isArray(run))throw Error('Expected JSON object');
 const entries=run.entries;
 if(!Array.isArray(entries))throw Error('entries must be an array');
 const allowed=new Set(suite.frameworks), tasks=new Map(suite.tasks.map(t=>[t.id,t]));
 const seen=new Set(), versions=new Map();
 for(const entry of entries){
  if(!entry||!allowed.has(entry.framework)||!tasks.has(entry.taskId)) {errors.push('Unknown framework/task');continue}
  const key=entry.framework+':'+entry.taskId;
  if(seen.has(key)){errors.push('Duplicate '+key);continue}
  seen.add(key);
  if(typeof entry.model!=='string'||!entry.model.trim()||typeof entry.modelVersion!=='string'||!entry.modelVersion.trim()||typeof entry.frameworkVersion!=='string'||!entry.frameworkVersion.trim())errors.push('Missing provenance '+key);
  if(!Number.isInteger(entry.attempt)||entry.attempt!==1)errors.push('Invalid attempt '+key);
  if(typeof entry.html!=='string'||entry.html.length>100000){errors.push('Invalid HTML '+key);continue}
  if(entry.temperature!==0)errors.push('Uncontrolled temperature '+key);
  const modelId=entry.model+':'+entry.modelVersion;
  versions.set(key,modelId);
  const task=tasks.get(entry.taskId),html=entry.html, checks={};
  for(const tag of task.criteria.tags)checks['tag:'+tag]=new RegExp('<'+tag+'(?:\\s|>)','i').test(html);
  if(task.criteria.minCards)checks.cards=(html.match(/<article(?:\s|>)/gi)||[]).length>=task.criteria.minCards;
  if(task.criteria.minLabels)checks.labels=(html.match(/<label(?:\s|>)/gi)||[]).length>=task.criteria.minLabels;
  if(task.criteria.rtl)checks.rtl=/\bdir\s*=\s*["']rtl["']/i.test(html);
  if(task.criteria.dark)checks.dark=/\bdark\b|data-theme\s*=\s*["']dark["']/i.test(html);
  checks.noInlineEvents=!/<[^>]+\son[a-z]+\s*=/i.test(html);
  checks.noScripts=!/<\s*script\b/i.test(html);
  scores.push({framework:entry.framework,taskId:entry.taskId,checks,passed:Object.values(checks).every(Boolean)});
 }
 for(const framework of suite.frameworks)for(const task of suite.tasks)if(!seen.has(framework+':'+task.id))errors.push('Missing '+framework+':'+task.id);
 for(const task of suite.tasks){
  const models=suite.frameworks.map(f=>versions.get(f+':'+task.id)).filter(Boolean);
  if(new Set(models).size>1)errors.push('Model versions differ for task '+task.id);
 }
 const summary=suite.frameworks.map(framework=>({framework,passed:scores.filter(s=>s.framework===framework&&s.passed).length,total:suite.tasks.length}));
 return {schemaVersion:suite.schemaVersion,eligible:errors.length===0,errors,summary,results:scores,note:'Static HTML structure only; browser, accessibility and visual parity require separate evaluation'};
}
if(require.main===module){
 try{
  const file=process.argv[2];
  if(!file)throw Error('Usage: node evaluations/compare-frameworks.cjs results.json');
  const report=score(JSON.parse(fs.readFileSync(path.resolve(file),'utf8')));
  console.log(JSON.stringify(report,null,2));
  if(!report.eligible||report.summary.some(s=>s.passed!==s.total))process.exitCode=2;
 }catch(e){console.error(e.message);process.exitCode=1}
}
module.exports={score};
