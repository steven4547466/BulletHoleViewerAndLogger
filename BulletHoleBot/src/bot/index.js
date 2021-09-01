const setup = require('./utils/setup/');

const Eris = require("eris");
const ErisComponents = require('eris-components');

class Bot extends ErisComponents.Client {
    constructor(token, options, erisComponentOptions){
        let erisClient = new Eris(token, options)
        super(erisClient, erisComponentOptions)

        this.erisClient = erisClient

        this.commands = new Map();
        this.aliases = new Map();

        setup.init(this)
    }
}


module.exports = Bot