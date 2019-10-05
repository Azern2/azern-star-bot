module.exports = {
    listenerName: "ready",
    once: false,
    enabled: true,
    run(bot) {
        console.log(`Connected as ${bot.user.tag}!`);
    }
};