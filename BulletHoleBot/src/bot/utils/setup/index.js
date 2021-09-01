let loadCommands = require("./loadCommands");
let loadEvents = require("./loadEvents");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json"));
//inital function called to load commands
async function init(client) {
    client.config = config;
    new loadCommands(client);
    new loadEvents(client);
    client.erisClient.connect()
}

module.exports = {init}