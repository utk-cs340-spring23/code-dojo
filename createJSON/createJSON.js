const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb://rootuser:rootpass@localhost:27017/";
// Create a new MongoClient
const client = new MongoClient(uri);
// Access database from mongodb
const theDB = client.db("room");
// Access a Collection in theDB
let theCollection;
let splitInput;
let theDoc;


// Create a server
http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  // Serve the webpage
  if (reqUrl.pathname === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
  }

  // Handle the form submission
  if (reqUrl.pathname === '/create-files' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const formData = JSON.parse(body);

      const filename = formData.filename;
      const jsonData = formData.data;

      for (let i = 0; i < jsonData.length; i++) {
        const filePath = path.join(__dirname, `${filename}-${i+1}.json`);
        const fileContent = JSON.stringify(jsonData[i]);
        fs.writeFile(filePath, fileContent, (err) => {
          if (err) {
            console.error(`Error writing file ${filePath}: ${err}`);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, error: err}));
            return;
          }
          console.log(`File ${filePath} written successfully`);
        });
      }
      // Grab collection and Insert Doc
      theCollection = theDB.collection("questions");
      theDoc = fileContent;
      theCollection.insertOne(theDoc);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({success: true}));
    });
  }
}).listen(8080, () => console.log('Server listening on port 8080'));
