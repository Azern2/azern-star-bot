module.exports = {
    // Secret credentials
    BOT_TOKEN: process.env.DISCORD_TOKEN,
    HYPIXEL_API_KEY: process.env.HYPIXEL_API_KEY,
  
    // Strings
    BOT_OWNER_ID: "345539839393005579",
    BOT_OWNER_TAG: (message) => message.guild.members
        .get(module.exports.BOT_OWNER_ID).user.tag,
  
    RANK_REQUEST_CHANNEL_ID: "422259585798242314",
    RANK_REQUEST_HELP_MESSAGE_ID: "https://discordapp.com/channels/384804710110199809/" +
    "616018913813069954",
    USER_AGENT: `KarenBot/${require("../../package.json").version} (+https://github.com/` +
    "PostFarmer/Karen-Discord)",
  
    // Roles
    ROLES_SAFE: {
        STONE: "616005162380689511",
        IRON: "616005162179362821",
        GOLD: "616005161361473743",
        DIAMOND: "616005160505704595",
        EMERALD: "616005160069758979",
        SAPPHIRE: "616005159369179137",
        RUBY: "616005159167983616",
        CRYSTAL: "616005158136053770",
        OPAL: "616005157938790413",
        AMETHYST: "616005157389336684",
        RAINBOW: "616005156756127792",
      
        NEED_USERNAMES: "480448464220585984",
        NEED_USERNAME: "470511160412733441",
        WAITING_ROOM: "588154312094384144",
        LIMBO: "573268100112449536"
    },
  
    // Emojis
    EMOJIS: {
        NO_GOOD: "🙅",
        PING_PONG: "🏓",
        BLUE_CHECK: "☑",
        GREEN_CHECK: "✅"
    },
  
    // Colors
    COLORS: {
        BLURPLE: "7289DA",
        LIGHT_RED: "#F75348"
    }
};