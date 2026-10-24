const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('agent instructions and onboarding guides exist',()=>{
 for(const name of ['AGENTS.md','AI_INTEGRATION.md','INTEGRATION_READINESS.md','integrations/AI_TEST_BRIEF.md'])
  assert.ok(fs.readFileSync(path.join(root,name),'utf8').length>100,name);
});
test('sample MCP configuration is parseable',()=>{
 const obj=JSON.parse(fs.readFileSync(path.join(root,'integrations/mcp-config.example.json'),'utf8'));
 assert.equal(obj.mcpServers.simplicss.command,'node');
 assert.ok(obj.mcpServers.simplicss.args[0].endsWith('bin/simplicss-mcp.cjs'));
});
test('package metadata matches checked-in GPL license',()=>{
 const license=fs.readFileSync(path.join(root,'LICENSE'),'utf8');
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 assert.match(license,/GNU GENERAL PUBLIC LICENSE/);
 assert.equal(pkg.license,'GPL-3.0-only');
 assert.equal(pkg.name,'simplicss');
 assert.equal(pkg.main,'./index.cjs');
});

test('package entrypoint exports AI tooling and CSS compiler',()=>{
 const api=require('../');
 for(const name of ['compile','build','manifest','validate','listComponents','renderComponent'])
  assert.equal(typeof api[name],'function',name);
});
