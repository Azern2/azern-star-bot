const { CommandError, Constants, Command } = require("../../../index.js");
const fetch = require("node-fetch");

module.exports = class ForceVerify extends Command {
    constructor(client) {
        super(client, {
            name: "force-verify",
            group: "auth",
            format: "<user> <username>",
            memberName: "force-verify",
            description: "Marks a member as verified",
            details: "If the user has a space in their name, surround their names in " +
            "quotes to form a capture group.",
            guildOnly: true,
            aliases: ["forcify"],
            examples: [">>forceverify Marshmont#5625 Marshmont"],
            userPermissions: ["MANAGE_ROLES"],
            clientPermissions: ["MANAGE_ROLES"],
            throttling: { usages: 1, duration: 3 },
            args: [
                {
                    key: "member",
                    type: "member",
                    error: "Invalid user",
                    prompt: "Who are you verifying?"
                },
                {
                    key: "username",
                    type: "string",
                    error: "Invalid username",
                    prompt: "What is the member's username?",
                    validate: (text) => /^\w{1,16}$/.test(text)
                }
            ]
        });
    }
  
    run(message, { member, username }) {
        let baseURL = "https://api.hypixel.net/player?";
        let verified = this.client.settings.get("verified");
      
        if (verified[member.id]) {
            return message.reply("that user is already verified!")
                .then((msg) => msg.delete({ timeout: 6000 }));
        }
      
        return fetch(baseURL + `name=${username}&key=${Constants
            .HYPIXEL_API_KEY}`).then((res) => this.checkStatus(res)).then(async (json) => {
            if (json.success) {
                if (json.player) {
                    if (!json.player.achievements || !json.player.achievements.bedwars_level) {
                        return message.reply("this user seems to not have any achievements/levels")
                            .then((msg) => msg.delete({ timeout: 8000 }));
                    }
                  
                    let player = json.player;
                    let level = player.achievements.bedwars_level;
                    let star = Command.userStar(level);
                  
                    if (level < 10) {
                        level = "0" + level;
                    }
                                    
                    let levelRole = Command.userStarRole(message, level);
                    let nickname = `[${level} ${star}] ${player.displayname}`;
                    let newRoles = [levelRole.id, ...member.roles.filter((role) => {
                        return !Object.values(Constants.ROLES_SAFE).includes(role.id);
                    }).map((role) => role.id)];
                  
                    verified[member.id] = { UUID: player.uuid, userID: member.id };
                    this.client.settings.set("verified", verified);
                  
                    if (member.nickname !== nickname) {
                        await member.setNickname(nickname);
                    }
                  
                    if (newRoles.some((roleID) => !member.roles.has(roleID))) {
                        await member.roles.set(newRoles);
                    }
                  
                    message.member.roles.remove("616005155925655648").catch(console.error);
                    
                    return message.channel.send(`${Constants.EMOJIS.GREEN_CHECK} Successfully ` +
                                                `verified **${member.user.tag}**.`);
                }
              
                return CommandError.ERR_NOT_FOUND(message, "username", username);
            }
              
            if (json.cause === "Invalid API key!") {
                return message.say("There seems to be a missing API key. Please contact " +
                                   `${Constants.BOT_OWNER_TAG(message)} to resolve this issue.`);
            }
              
            return message.say("Invalid user");
        });
    }
};