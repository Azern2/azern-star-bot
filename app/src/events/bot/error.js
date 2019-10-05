module.exports = {
    listenerName: "error",
    once: false,
    enabled: true,
    run(bot, err) {
        bot.logger.error(err);
    }
};