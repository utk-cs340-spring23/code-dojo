// Input from stdin
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

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

async function run() {
  try{

    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server...");
    
    rl.on('line', (line) => {
        if(line === "exit"){
            console.log("Exiting...");
            process.exit(0);
        }

        splitInput = line.split(" ");
        
        // adding new student
        if(splitInput[0] === "newStudent"){
            console.log("Creating new student...");
            theCollection = theDB.collection("students");
            theDoc = {"firstName": splitInput[1], "lastName": splitInput[2]}
            theCollection.insertOne(theDoc);
        }
        // removing student
        if(splitInput[0] === "rmStudent"){
            console.log("Removing student...");
            theCollection = theDB.collection("students");
            theDoc = {"firstName": splitInput[1], "lastName": splitInput[2]}
            theCollection.deleteOne(theDoc);
        }
        // adding new instructor
        else if(splitInput[0] === "newInstructor"){
            console.log("Creating new instructor...");
            theCollection = theDB.collection("instructor");
            theDoc = {"firstName": splitInput[1], "lastName": splitInput[2]}
            theCollection.insertOne(theDoc);
        }
        // removing instructor
        else if(splitInput[0] === "rmInstructor"){
            console.log("Removing instructor...");
            theCollection = theDB.collection("instructor");
            theDoc = {"firstName": splitInput[1], "lastName": splitInput[2]}
            theCollection.deleteOne(theDoc);
        }
        // error, unrecognized add
        else{
            console.log("Unrecognized add, exiting...");
            process.exit(0);
        }

    });
    rl.once('close', () => {});

  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);
