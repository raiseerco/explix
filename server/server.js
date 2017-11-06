const createContext = require('./context').createContext;
const express = require('express');
const fs = require("mz/fs");
const path = require("path");

const app = express();
const api = express.Router();

let contexts, server;

app.use(function(err, req, res, next) {
    if(!err || err.status === 404) return next(); //  TODO: Apparently is required, check if it will be at the end of the implementation
    console.error(err.stack);
    console.error(err);
    res.status(500).send(err);
});




async function createContexts() {
    console.log("Creating contexts...");
    const contextsDir = "./contexts";
    const contexts = [];
    for (const name of await fs.readdir(contextsDir)) {
        const config = JSON.parse(await fs.readFile(
            path.join(contextsDir, name)
        ));
        contexts.push(createContext(config));
    }
    return contexts;
}

createContexts().then( (_contexts) => {
    contexts = _contexts;
    server = app.listen(4000, function() {
        console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
        console.log('Example app listening at http://%s:%s', server.address().address, server.address().port);
        console.log('environment mode ' + app.get('env'));
    });

}).catch( err => {
    console.error(err);
});