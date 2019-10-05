const { Command } = require("../../../index.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "",
            group: "",
            format: "",
            memberName: "",
            description: "",
            details: "",
            nsfw: false,
            hidden: false,
            guarded: false,
            guildOnly: false,
            ownerOnly: false,
            aliases: [],
            examples: [],
            userPermissions: [],
            clientPermissions: [],
            throttling: { usages: 1, duration: 3 }
        });
    }
  
    run(message) {
      
    }
};