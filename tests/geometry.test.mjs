import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const context=vm.createContext({LCK:{},Math});
vm.runInContext(readFileSync('References.html','utf8').replace(/<\/?script>/g,''),context);
const {paths,reference,geometry:g}=context.LCK;
for(const char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'){
 test(`${char}: correct, child variation, partial, distant, reversed, extra, tap`,()=>{
  assert.ok(paths[char]);const r=reference(char),a=r.map(s=>g.resample(s));
  assert.equal(g.validate(a,r).ok,true,'correct reference');
  const imperfect=a.map(s=>s.map((p,i)=>[p[0]+.018*Math.sin(i/5),p[1]+.02*Math.cos(i/7)]));
  assert.equal(g.validate(imperfect,r).ok,true,'reasonable child variation');
  assert.equal(g.validate(a.map(s=>s.slice(0,25)),r).ok,false,'partial stroke');
  assert.equal(g.validate(a.map(s=>s.map(p=>[p[0]+.35,p[1]+.4])),r).ok,false,'far outside');
  assert.equal(g.validate(a.map(s=>s.slice().reverse()),r).ok,false,'reverse direction');
  assert.equal(g.validate([...a,a[0]],r).ok,false,'extra scribble');
  assert.equal(g.validate(r.map(s=>[s[0]]),r).ok,false,'tap only');
  assert.equal(g.validate([],r).ok,false,'empty');
  if(r.length>1)assert.equal(g.validate(a.slice(0,-1),r).ok,false,'missing component');
 });
}
test('long scribble cannot pass by covering the reference',()=>{
 const r=reference('A');const a=r.map(s=>g.resample(s).flatMap(p=>[p,[p[0]+.2,p[1]+.2],p]));assert.equal(g.validate(a,r).ok,false);
});
