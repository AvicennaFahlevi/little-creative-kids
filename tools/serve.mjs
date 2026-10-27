import http from 'node:http';
import {readFileSync} from 'node:fs';
import './build.mjs';
http.createServer((req,res)=>{if(!['/','/index.html'].includes(req.url.split('?')[0])){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(readFileSync('index.html'));}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
