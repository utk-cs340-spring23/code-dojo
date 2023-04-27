const path = require('path');
const http = require('http');
const url = require('url');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const indexHtml = fs.readFileSync('index.html');
const err404Html = fs.readFileSync('404.html');


const server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    switch (pathname) {
        case '/':
            // Redirect to /index.html
            res.writeHead(301, { 'Location': '/index.html' });
            res.end();
            break;
        default:
            // Check if the request is for index.html
            if (path.basename(pathname) === 'index.html') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(indexHtml);
                res.end();
            } else {
                // Send a 404 Not Found response for all other URLs
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(err404Html);
                res.end();
            }
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
