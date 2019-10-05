const { Constants, Command } = require("../../../index.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            group: "root",
            memberName: "ping",
            description: "Get response time",
            throttling: { usages: 1, duration: 3 }
        });
    }
  
    run(message) {
        return message.say("Pinging...").then((msg) => {
            return msg.edit(`${Constants.EMOJIS.PING_PONG} Pong! Response time: ` +
                            `\`${msg.createdTimestamp - message.createdTimestamp}ms\``);
        });
    }
};