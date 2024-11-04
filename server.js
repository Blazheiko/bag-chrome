'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PORT = 8002;

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
};

const receiveArgs = async (req) => {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    return  Buffer.concat(buffers);
};

const server =  http.createServer(async (req, res) => {

    if(req.url === '/' || req.url.includes('.')){
        let ext = 'html';
        let filePath = 'index.html';
        if(req.url !== '/'){
            ext = req.url.split('.')[1]
            filePath = path.join(process.cwd(), req.url);
        }
        const mimeType = MIME_TYPES[ext] || MIME_TYPES.default;
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end(`Server error: ${err.code}`, 'utf-8');
                }
            } else {
                res.writeHead( 200, { 'Content-Type': mimeType });
                res.end( content, 'utf-8');
            }
        });
    }else if(req.url === '/save-video' && req.method === 'POST'){
        console.log('/save-video')
        const data = await receiveArgs(req)

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end( JSON.stringify({status: 'ok'}));
    }else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
    }


    console.log(`${req.method} ${req.url}`);
})
server.listen(PORT);

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.log(`No access to port: ${PORT}`);
    }
});

console.log(`Server running at http://127.0.0.1:${PORT}/`);
