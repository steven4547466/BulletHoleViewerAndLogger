module.exports = class {
    constructor (client) {
      this.client = client;
      this.prefix = client.config.prefix;
    }

    async run (message) {
      if (message.author.bot) return;

      if(!message.content.toLowerCase().startsWith(this.prefix)) return;

      let args = message.content.slice(this.prefix.length).trim().split(' ');
      let cmd = args[0].toLowerCase();
      args.shift();
      let command

      if(this.client.commands.has(cmd)) {
        command = this.client.commands.get(cmd)
        command.run(message, args, this.client)
      }else {
        for(let [alias, name] of this.client.aliases){
          if(alias == cmd){
            command = this.client.commands.get(name)
            command.run(message, args, this.client)
          }
        }
      }
    }

}