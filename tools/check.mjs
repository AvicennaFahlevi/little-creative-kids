import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
for(const file of readdirSync('.').filter(f=>f.endsWith('.html')&&f!=='index.html')){
  for(const [,source] of readFileSync(file,'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(source,{filename:file});
}
for(const file of readdirSync('.').filter(f=>f.endsWith('.gs')))new vm.Script(readFileSync(file,'utf8'),{filename:file});
const manifest=JSON.parse(readFileSync('appsscript.json','utf8'));
assert.equal(manifest.webapp.executeAs,'USER_ACCESSING');
assert.equal(manifest.webapp.access,'MYSELF');
const shell=readFileSync('Shell.html','utf8');
for(const [,name] of shell.matchAll(/include_\('([^']+)'\)/g))assert.ok(readFileSync(name+'.html','utf8'));
const names=readdirSync('.');assert.equal(new Set(names.map(n=>n.toLowerCase())).size,names.length);
console.log('All HTML scripts, server scripts, includes, manifest, and filename casing passed.');
