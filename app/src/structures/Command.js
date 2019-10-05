// Extending the Commando command so I can apply some cool changes

const Commando = require("discord.js-commando");
const Constants = require("../utils/Constants.js");

class Command extends Commando.Command {
    constructor(client, options) {
        options.argsPromptLimit = 2;
      
        super(client, options);
    }
  
    static base10(hex) {
        return parseInt(hex.replace("#", ""), 16);
    }
  
    static cleanPermissions(perms, join = ", ") {
        if (typeof perms === "string") {
            return perms.toLowerCase().replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            }).replace("Use Vad", "Use Voice Activation Detection").replace("Tts", "TTS");
        } else if (Array.isArray(perms)) {
            return perms.join(join).toLowerCase().toLowerCase().replace(/_/g, " ")
                .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1)
                    .toLowerCase()).replace("Use Vad", "Use Voice Activation Detection")
                .replace("Tts", "TTS");
        }
      
        throw new TypeError(`First argument must be a string or array. Received ${typeof perms}`);
    }
  
    static userStar(level) {
        if (level < 100) {
            return "⭐";
        } else if (level < 200) {
            return "🌟";
        } else if (level < 300) {
            return "✨";
        } else if (level < 400) {
            return "💫";
        } else if (level < 500) {
            return "☄";
        } else if (level < 600) {
            return "✩";
        } else if (level < 700) {
            return "✵";
        } else if (level < 800) {
            return "✫";
        } else if (level < 900) {
            return "✰";
        } else if (level < 1000 || level > 1000) {
            return "✯";
        }
        
        return "???";
    }
  
    static userStarRole(message, level) {
        let role = (id) => message.guild.roles.get(id);
        let roles = Constants.ROLES_SAFE;
      
        if (!level) {
            return null;
        }
            
        if (level < 100) {
            return role(roles.STONE);
        } else if (level < 200) {
            return role(roles.IRON);
        } else if (level < 300) {
            return role(roles.GOLD);
        } else if (level < 400) {
            return role(roles.DIAMOND);
        } else if (level < 500) {
            return role(roles.EMERALD);
        } else if (level < 600) {
            return role(roles.SAPPHIRE);
        } else if (level < 700) {
            return role(roles.RUBY);
        } else if (level < 800) {
            return role(roles.CRYSTAL);
        } else if (level < 900) {
            return role(roles.OPAL);
        } else if (level < 1000) {
            return role(roles.AMETHYST);
        } else if (level > 1000) {
            return role(roles.RAINBOW);
        }
    }
  
    static userRank(message, rank) {
        switch (rank.toLowerCase()) {
            case "helper":
            case "moderator":
            case "admin":
            case "youtuber":
        }
    }
  
    onError(err, msg) {
        msg.reply("something went wrong. Try again later?");
      
        this.client.logger.error(err);
    }
  
    onBlock(message, reason, data) {
        switch (reason) {
            case "nsfw": {
                return message.say(`${Constants.EMOJIS.NO_GOOD} This command is restricted to ` +
                                   "NSFW channels.").then((msg) => msg.delete({timeout: 8000}));
            }
            
            case "guildOnly": {
                return message.say(`${Constants.EMOJIS.NO_GOOD} This comamnd can only be run in` +
                                   "a server.").then((msg) => {
                    return msg.delete({timeout: 7500});
                });
            }
            
            case "permission": {
                return message.say(data.response).then((msg) => msg.delete({ timeout: 7000 }));
                // return message.say(`You do not have permission to \`${Command
                //     .cleanPermissions(data.response, "`, `")}\``)
                //     .then((msg) => msg.delete({timeout: 6500}));
            }
            
            case "throttling": {
                return message.say(`Please wait **${data.remaining.toFixed(1)}** seconds before ` +
                                   "running this command again.").then((msg) => {
                    return msg.delete({timeout: 6500});
                });
            }
            
            case "clientPermissions": {
                return message.reply(`I do not have permission to \`${Command
                    .cleanPermissions(data.missing, "`, `")}\``).then((msg) => {
                    return msg.delete({timeout: 7500});
                });
            }
            
            default: {
                return message.reply("something went wrong. Try again later?");
            }
        }
    }
  
    hasPermission(message, ownerOverride = true) {
        if (!this.ownerOnly && !this.userPermissions) {
            return true;
        }
      
        if (ownerOverride && this.client.isOwner(message.author)) {
            return true;
        }
      
        if (this.ownerOnly && (ownerOverride || !this.client.isOwner(message.author))) {
            return "lol no";
        }
      
        if (message.channel.type === "text" && this.userPermissions) {
            const missing = message.member.permissions.missing(this.userPermissions);
          
            if (missing.length > 0) {
                if (missing.length === 1) {
                    return `The \`${this.name}\` command requires you to have the "${this
                        .constructor.cleanPermissions(missing[0])}" permission.`;
                }
              
                return `The \`${this.name}\` command requires you to have the following ` +
                `permissions: ${missing.map((perm) => this.constructor.cleanPermissions(perm))
                    .join(", ")}`;
            }
        }
      
        return true;
    }
  
    checkStatus(res, format = "json") {
        if (res.ok) {
            return res[format]();
        }
      
        throw new Error(`${res.status} ${res.statusText}`);
    }
}

module.exports = Command;