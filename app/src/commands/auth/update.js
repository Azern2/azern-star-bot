// Note: Renamed the command from level to update.
// => Reason: The command is so users can update their star level without having
// to wait for a staff member to update it for them. Leaving the name as it is is a better option
// than changing it. Also caused confusion on why the command wasn't working.

const { CommandError, Constants, Command } = require("../../../index.js");
const fetch = require("node-fetch");

module.exports = class Update extends Command {
    constructor(client) {
        super(client, {
            name: "update",
            group: "auth",
            format: "[user]",
            memberName: "update",
            description: "Update your star",
            details: "Only members with `Manage Roles` can update another user's star level.",
            guildOnly: true,
            examples: [">>update Doblox"],
            clientPermissions: ["MANAGE_ROLES", "MANAGE_NICKNAMES"],
            throttling: { usages: 1, duration: 10 },
            args: [{
                key: "member",
                type: "member",
                error: "Invalid user",
                prompt: "Who would you like to update?",
                default: (msg) => msg.member
            }]
        });
    }
  
    run(message, { member }) {
        if ([Constants.ROLES_SAFE.LIMBO, Constants.ROLES_SAFE.WAITING_ROOM]
            .some((roleID) => message.member.roles.has(roleID))) {
            return CommandError.ERR_MISSING_PERMS(message);
        }
      
        if (message.member !== member && !message.member.hasPermission("MANAGE_ROLES")) {
            return CommandError.EMISACC(message, "update the star level of other users.", false);
        }
      
        let target = (this.client.settings.get("verified") || {})[member.id];
            
        if (target) {
            return this.request(`player?uuid=${target.UUID}&key=${Constants.HYPIXEL_API_KEY}`)
                .then(async (json) => {
                    if (json.success) {
                        if (member.manageable) {
                            let { player } = json;
                            let star = Command.userStar(player.achievements.bedwars_level);
                            let level = player.achievements.bedwars_level;
                            let levelRole = Command.userStarRole(message, level);
                          
                            if (level < 10) {
                                level = "0" + level;
                            }
                          
                            let nickname = `[${level} ${star}] ${player.displayname}`;
                            let roles = [levelRole.id, ...member.roles.filter((role) => {
                                return !Object.values(Constants.ROLES_SAFE).includes(role.id);
                            }).map((role) => role.id)];
                          
                            if (member.nickname === nickname && roles
                                .every((roleID) => member.roles.has(roleID))) {
                                if (message.member === member) {
                                    return message.say("Your roles and nickname seem to already " +
                                                       "be up-to-date.")
                                        .then((msg) => msg.delete({ timeout: 6500 }));
                                }
                              
                                return message.say(`**${member.user.tag}**'s roles and nickname ` +
                                                   "seem to be up-to-date")
                                    .then((msg) => msg.delete({ timeout: 7000 }));
                            }
                          
                            if (member.nickname !== nickname) {
                                await member.setNickname(nickname);
                            }
                          
                            if (roles.some((roleID) => !member.roles.has(roleID))) {
                                await member.roles.set(roles);
                            }

                            return message.reply(`${member !== message.member
                                ? `**${member.user.tag}**'s`
                                : "Your"} nickname and roles have been updated.`);
                        }
                      
                        if (message.member === member) {
                            return message.reply("I cannot edit your roles or nickname. Please " +
                                                 "update your stars yourself or contact a " +
                                                 "staff member.")
                                .then((msg) => msg.delete({ timeout: 8000 }));
                        }
                      
                        return message.reply(`I'm unable to edit **${member.user.tag}**'s roles ` +
                                             "or nickname. Please update the nickname and roles " +
                                             "yourself instead")
                            .then((msg) => msg.delete({ timeout: 8000 }));
                    }
                    
                    return message.reply("There seems to be a problem with the Hypixel API. " +
                                         "Try again later or contact a staff member.");
                });
        }
      
        if (message.member === member) {
            return CommandError.EMISACC(message, "use this command. Your account must be " +
                                        "verified to do this.", false);
        }
      
        return message.reply("this user doesn't seem to have their account linked.")
            .then((msg) => msg.delete({ timeout: 7000 }));
    }
  
    request(pathway) {
        return fetch(`https://api.hypixel.net/${pathway}`, {
            headers: { "User-Agent": Constants.USER_AGENT }
        }).then(this.checkStatus);
    }
};