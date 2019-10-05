const { Command, Constants, CommandError } = require("../../../index.js");
const fetch = require("node-fetch");

module.exports = class Verify extends Command {
    constructor(client) {
        super(client, {
            name: "verify",
            group: "auth",
            format: "<username>",
            memberName: "verify",
            description: "Verifies your account",
            details: "In order to verify, the account you use for Hypixel must be linked with " +
            "your Discord tag. In order to verify, follow the following steps:\n" +
            [
                "Go to a lobby",
                "Right click your head",
                "Click the social menu",
                "Paste your Discord Username in chat as it instructs."
            ].map((str, index) => `\`${index + 1}.\` ${str}`).join("\n"),
            guildOnly: true,
            examples: [">>verify PostFarmer"],
            clientPermissions: ["MANAGE_ROLES"],
            throttling: { usages: 3, duration: 15 },
            args: [{
                key: "username",
                type: "string",
                error: "Invalid username",
                prompt: "What is your Minecraft username?",
                validate: (text) => /^[\w]{1,16}$/i.test(text)
            }]
        });
    }
  
    run(message, { username }) {
        let verified = this.client.settings.get("verified") || {};
      
        if ([Constants.ROLES_SAFE.LIMBO, Constants.ROLES_SAFE.WAITING_ROOM]
            .some((roleID) => message.member.roles.has(roleID))) {
            return CommandError.ERR_MISSING_PERMS(message);
        }
      
        if (verified[message.author.id]) {
            return message.say("Unable to verify account: Your account is already verified.")
                .then((msg) => msg.delete({ timeout: 6000 }));
        }
      
        return this.request(`player?name=${encodeURIComponent(username)}` +
                            `&key=${Constants.HYPIXEL_API_KEY}`).then(async (json) => {
            if (json.success) {
                let player = json.player;
              
                if (player) {
                    let existingEntry = Object.values(verified)
                        .find((val) => val.UUID === player.uuid);
                  
                    if (existingEntry) {
                        let existingUser = message.guild.members.get(existingEntry.userID);
                      
                        return message.reply("Unable to verify account: A member with this " +
                                             `username is already registered. (${existingUser
                                                 ? existingUser.user.tag : "???"})`);
                    }
                  
                    let discordTag = player.socialMedia && player.socialMedia
                        .links ? player.socialMedia.links.DISCORD : null;
                  
                    if (discordTag) {
                        if (discordTag === message.author.tag) {
                            verified[message.author.id] = {
                                UUID: player.uuid,
                                userID: message.author.id
                            };
                          
                            let star = Command.userStar(player.achievements.bedwars_level);
                            let level = player.achievements.bedwars_level;
                            let levelRole = Command.userStarRole(message, level);
                          
                            if (level < 10) {
                                level = "0" + level;
                            }
                          
                            let nickname = `[${level} ${star}] ${player.displayname}`;
                            let roles = [levelRole.id, ...message.member.roles.filter((role) => {
                                return !Object.values(Constants.ROLES_SAFE).includes(role.id);
                            }).map((role) => role.id)];
                          
                            await this.client.settings.set("verified", verified);
                          
                            if (message.member.nickname !== nickname) {
                                await message.member.setNickname(nickname).catch(() => {});
                            }
                         
                            if (roles.some((roleID) => !message.member.roles.has(roleID))) {
                                await message.member.roles.set(roles, "Successfully verified");
                                let unverified = message.guild.roles.get("616005155925655648");
                                message.member.roles.remove(unverified).catch(console.error);
                            }
                          
                            if (message.channel.id === Constants.RANK_REQUEST_CHANNEL_ID) {
                                let messages = await message.channel.messages.fetch({ limit: 100 })
                                    .then((msgs) => msgs.filter((msg) => {
                                        return !msg.pinned && msg.author.id === message.author.id ||
                                        msg.mentions.members.has(message.author.id);
                                        // Fetch karen's messages
                                    }));
                              
                                message.channel.bulkDelete(messages, true);
                            }
                          
                            message.member.roles.remove("616005155925655648").catch(console.error);

                          
                            return message.channel.send(`${Constants.EMOJIS
                                .GREEN_CHECK} Your account has been verified as **${player
                                .displayname}**.`).then((msg) => msg.delete({ timeout: 8000 }));
                        }
                      
                        if (discordTag.startsWith("https://discord")) {
                            discordTag = "<invite snip>";
                        }
                      
                        return message.say("Unable to verify account: The Discord tag associated " +
                                           "with this player is not the same as your current " +
                                           `tag (${discordTag}).`);
                    }
                  
                    let content = "Unable to verify account: Please link your Discord account " +
                    "with your in-game account. If you cannot or don't understand, ask a staff " +
                    "member for assistance or view this message.\n" + Constants
                        .RANK_REQUEST_HELP_MESSAGE_ID;
                  
                    return message.say(content).then((msg) => msg.delete({ timeout: 30000 }));
                }
              
                return CommandError.ERR_NOT_FOUND(message, "username", username);
            }
          
            return message.say("There seems to be a problem with the Hypixel API. Try again later" +
                               ` or contact ${Constants
                .BOT_OWNER_TAG(message)} to resolve this issue.`);
        });
    }
  
    request(url) {
        return fetch("https://api.hypixel.net/" + url, {
            headers: { "User-Agent": Constants.USER_AGENT }
        }).then(this.checkStatus);
    }
};