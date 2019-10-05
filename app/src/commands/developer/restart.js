const { Command } = require("../../../index.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "restart",
            group: "developer",
            format: "[-y]",
            memberName: "restart",
            description: "Restarts the bot",
            details: "Using the `-y` flag will force a restart without a recaptcha. " +
            "If the bot is not running on a server which auto-restarts, the bot will " +
            "just stop running.",
            hidden: true,
            guarded: true,
            ownerOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [{
                key: "text",
                type: "string",
                error: "Invalid input",
                prompt: "Type `yes` or `no` to confirm actions.",
                oneOf: ["yes", "no", "y", "n"]
            }]
        });
    }
  
    run(message, { text }) {
        if (text === "yes" || text === "y") {
            return message.say("Restarting...").then(async () => {
                await this.client.provider.destroy();
                process.exit(1);
            });
        }
      
        return message.say("Restart cancelled...");
    }
};