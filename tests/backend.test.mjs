import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const c=vm.createContext({Utilities:{base64Decode:s=>Array.from(Buffer.from(s,'base64')),newBlob:(b,m)=>({bytes:b,mime:m})}});
vm.runInContext(readFileSync('Config.gs','utf8')+readFileSync('Storage.gs','utf8'),c);
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==';
test('valid PNG accepted with fixed MIME',()=>assert.equal(c.validatePng_(png).mime,'image/png'));
test('reject invalid uploads',()=>{for(const value of [null,'hello','data:text/html;base64,PGgxPg==',png.slice(0,-10),png.replace('AAAAEAAAAB','AAAAEAAABB'),'data:image/png;base64,'+'A'.repeat(4200000)])assert.throws(()=>c.validatePng_(value));});
test('cloud opt-in and user identity required',()=>{
 c.Session={getActiveUser:()=>({getEmail:()=>''}),getEffectiveUser:()=>({getEmail:()=> 'owner@example.test'})};assert.throws(()=>c.setCloudStorageEnabled(true));
 c.Session={getActiveUser:()=>({getEmail:()=> 'parent@example.test'}),getEffectiveUser:()=>({getEmail:()=> 'parent@example.test'})};
 const props=new Map();c.PropertiesService={getUserProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})};
 assert.equal(c.getCloudStorageStatus().enabled,false);assert.throws(()=>c.saveArtworkToDrive(png));c.setCloudStorageEnabled(true);assert.equal(c.getCloudStorageStatus().enabled,true);assert.throws(()=>c.setCloudStorageEnabled('true'));
});
