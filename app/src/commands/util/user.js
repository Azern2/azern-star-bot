const { CommandError, Constants, Command } = require("../../../index.js");
const dateformat = require("dateformat");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "user",
            group: "util",
            format: "[user]",
            memberName: "user",
            description: "Search for a verified user",
            details: "Pulls up basic statistics about a user, such as their bedwars level.",
            guildOnly: true,
            examples: [">>user Bud"],
            throttling: { usages: 1, duration: 5 },
            args: [{
                key: "user",
                type: "member",
                error: "Invalid user",
                prompt: "Who would you like to pull stats from?",
                wait: 30,
                default: (msg) => msg.member
            }]
        });
    }
  
    run(message, { user }) {
        let info = (this.client.settings.get("verified") || {})[user.id];
      
        if (info) {
            return this.sendRequest(`player?uuid=${info.UUID}&key=${Constants.HYPIXEL_API_KEY}`)
                .then((json) => {
                    if (json.success) {
                        if (json.player) {
                            let { player } = json;
                            let embed = new Discord.MessageEmbed()
                                .setFooter("Last online")
                                .setTitle(player.displayname)
                                .setThumbnail("https://visage.surgeplay.com/bust/304/" +
                                              player.uuid)
                                .setDescription(`<@${info.userID}> | First login: \`` +
                                    `${dateformat(player.firstLogin, "longDate")}\``)
                                .setURL(`https://hypixel.net/player/${player.displayname}`)
                                .addField("Hypixel Level", "Not available", true)
                                .addField("Bedwars Level", `${player.achievements
                                    .bedwars_level} (${Command.userStar(player.achievements
                                    .bedwars_level)})`, true)
                                .addField("Rank", this.userLevel(player.newPackageRank), true)
                                .addField("Karma", player.karma, true)
                                .setColor(Constants.COLORS.BLURPLE)
                                .setTimestamp(player.lastLogout);
                            
                            return message.embed(embed);
                        }
                      
                        return CommandError.ERR_NOT_FOUND(message, "Hypixel player");
                    }
              
                    return CommandError.ERR_CLIENT_ERR(message, "Hypixel API");
                }).catch((err) => this.client.logger.error(err));
        }
      
        return CommandError.ERR_NOT_FOUND(message, "verified member", user.user.username);
    }
  
    sendRequest(path) {
        return fetch(`https://api.hypixel.net/${path}`).then(this.checkStatus);
    }
  
    userLevel(rank = "???") {
        return rank.replace(/_PLUS/g, "+");
    }
};