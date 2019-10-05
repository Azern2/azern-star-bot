const { Command, Constants } = require("../../../index.js");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            group: "staff",
            format: "<amount> [filter]",
            memberName: "purge",
            description: "Delete a bunch of messages",
            details: "",
            guildOnly: true,
            aliases: ["clean", "cleanup"],
            examples: ["purge 10"],
            userPermissions: ["MANAGE_MESSAGES"],
            clientPermissions: ["MANAGE_MESSAGES"],
            args: [
                {
                    key: "amount",
                    label: "amount",
                    error: "Invalid number (Must be 2-100)",
                    prompt: "How many messages would you like to delete?",
                    type: "integer",
                    min: 2,
                    max: 100
                },
                {
                    key: "filter",
                    type: "string",
                    label: "filter",
                    error: "Invalid filter option",
                    prompt: "What type of filter would you like to apply? (user/channel " +
                    "mention, webhooks, etc)",
                    default: "any"
                }
            ]
        });
    }
  
    async run(message, { amount }) {
        await message.delete();
      
        let messageCollection = await message.channel.messages.fetch({ limit: amount })
            .then((msgs) => msgs.filter((msg) => !msg.pinned));
      
        let messages = await message.channel.bulkDelete(messageCollection, true);
        let cleanMsgs = messages.map((msg) => `__${msg.author.tag}__: ${msg.content || "???"}`);
        cleanMsgs.reverse();

        message.say(`${Constants.EMOJIS.GREEN_CHECK} Successfully ` +
                    `removed **${messages.size}** messages.`)
            .then((msg) => msg.delete({ timeout: 3000 })).catch(() => {});
            
        if (cleanMsgs.join("\n").length < 2048) {
            let embed = new MessageEmbed()
                .setTimestamp()
                .setColor(Constants.COLORS.LIGHT_RED)
                .setDescription(cleanMsgs.join("\n"))
                .setTitle(`Bulk Delete (${messages.size} messages)`);
          
            return message.guild.channels.get("425958447041740800").send(embed);
        }
      
        let str = "";
      
        for (const msg of cleanMsgs) {
            if ((str + msg).length > 2000) {
                let embed = new MessageEmbed()
                    .setTitle(`Bulk Delete (${messages.size}) messages`)
                    .setDescription(str)
                    .setTimestamp();
              
                message.embed(embed);
              
                str = "";
            } else {
                str += msg;
            }
        }
      
        if (str) {
            let embed = new MessageEmbed()
                .setTitle(`Bulk Delete (${messages.size}) messages`)
                .setDescription(str)
                .setTimestamp();
          
            return message.embed(embed);
        }
    }
};