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
test('release checklist flags license conflict',()=>{
 const license=fs.readFileSync(path.join(root,'LICENSE'),'utf8');
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
 assert.match(license,/GNU GENERAL PUBLIC LICENSE/);
 assert.notEqual(pkg.license,'GPL-3.0-only');
 assert.match(fs.readFileSync(path.join(root,'INTEGRATION_READINESS.md'),'utf8'),/Resolve/);
});
