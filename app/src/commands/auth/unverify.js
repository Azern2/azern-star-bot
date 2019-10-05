const { Command, Constants } = require("../../../index.js");

module.exports = class Unverify extends Command {
    constructor(client) {
        super(client, {
            name: "unverify",
            group: "auth",
            format: "<user>",
            memberName: "unverify",
            description: "Unverifies a member",
            details: "Unverifying a member will also remove their roles and send them back to " +
            "rank request. You must be a rank giver in order to use this command.",
            guildOnly: true,
            aliases: ["unlink"],
            examples: [">>unverify shrekster"],
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            throttling: { usages: 1, duration: 3 },
            args: [
                {
                    key: "member",
                    type: "member",
                    error: "Invalid user",
                    prompt: "Who would you like to unverify?"
                }
            ]
        });
    }
  
    run(message, { member }) {
        let verified = this.client.settings.get("verified");
        let userVerified = verified[member.id];
      
        if (userVerified) {
            delete verified[member.id];
            
            message.member.roles.add("616005155925655648").catch(console.error);
          
            return this.client.settings.set("verified", verified).then(() => {
                return message.say(`${Constants.EMOJIS.GREEN_CHECK} **${member.user.tag}** has ` +
                                   "been unverified.");
            }).catch(this.client.logger.error);
        }
      
        return message.reply("that user doesn't seem to be verified.").then((msg) => {
            return msg.delete({timeout: 7000});
        });
    }
};