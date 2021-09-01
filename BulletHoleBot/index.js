const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json"));

const Bot = require("./src/bot/index.js");

new Bot(config.token, config.clientOptions)