const { readdirSync } = require('fs');
const path = require("path")

class Functions {
    constructor(client) {
        this.client = client

        this.loadCommands()
    }
    
    //reads files in directory and loads commands
    _loadCommand = (commandPath, commandName) => {
          const props = new (require(`${commandPath}${path.sep}${commandName}`))(this.client);
          props.conf.location = commandPath;
          if (props.init) {
            props.init(this.client);
          }
          this.client.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            this.client.aliases.set(alias, props.help.name);
          });
          return false;
      }
    //reads directories one at a time to load commands
    loadCommands = async () => {
        readdirSync(__dirname + "/../../commands/").forEach((folder) => {
            readdirSync(__dirname + `/../../commands/${folder}`).filter(file => file.endsWith('.js')).forEach((f) => {
                this._loadCommand(__dirname + `/../../commands/${folder}`, f)
            });
        });
    } 
}

module.exports = Functions