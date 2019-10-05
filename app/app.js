const Commando = require("discord.js-commando");
const express = require("express");
const sqlite = require("sqlite");
const https = require("https");
const path = require("path");
const util = require("util");
const fs = require("fs");

const { Constants, Logger } = require("./index.js");
const readdir = util.promisify(fs.readdir);
const app = express();

const bot = new Commando.Client({
    commandPrefix: ">>",
    owner: ["345539839393005579"],
    disableEveryone: true,
    unknownCommandResponse: false,
    shardCount: 1,
    retryLimit: 3,
    restTimeOffset: 1000,
    messageCacheMaxSize: 100,
    messageSweepInterval: 3600,
    messageCacheLifetime: 604800,
    commandEditableDuration: 5,
    disabledEvents: ["TYPING_START", "VOICE_STATE_UPDATE"],
    presence: { activity: { name: ">>help", type: "LISTENING" } }
});

bot.logger = new Logger();

// app.get("/", (req, res) => res.sendStatus(200));

// // Fun fact: Posting the URL on Discord pings it for me.
// setInterval(() => https.get(`https://${process.env.PROJECT_DOMAIN}.glitch.me/`), 240000);
// app.listen(process.env.PORT);

bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ["root", "Root"],
        ["auth", "Verification"],
        ["developer", "Developer"],
        ["staff", "Staff"]
    ]).registerDefaultGroups().registerDefaultCommands({
        ping: false,
        eval: false,
        unknownCommand: false
    }).registerCommandsIn(path.join(__dirname, "src", "commands"));

bot.setProvider(sqlite.open(path.join(__dirname, "settings.sqlite")).then((db) => {
    return new Commando.SQLiteProvider(db);
}));

readdir("src/events/").then((eventEmitters) => {
    eventEmitters.forEach((emitter) => {
        readdir(`src/events/${emitter}/`).then((events) => {
            events.forEach((eventFilePath) => {
                // eslint-disable-next-line global-require
                let eventFile = require(`./src/events/${emitter}/${eventFilePath}`);
                let eventEmitter = eventType(emitter);
              
                if (eventFile.enabled) {
                    eventEmitter[eventFile.once ? "once" : "on"](eventFile
                        .listenerName, (...args) => {
                        if (eventEmitter instanceof Commando.Client) {
                            return eventFile.run(eventEmitter, ...args);
                        }
                      
                        return eventFile.run(eventEmitter, bot, ...args);
                    });
                }
            });
        }).catch((err) => {
            bot.logger.error(err);
            process.exit(1);
        });
    });
}).catch((err) => {
    bot.logger.error(err);
    process.exit(1);
});

bot.login(Constants.BOT_TOKEN);

function eventType(event) {
    switch (event.toLowerCase()) {
        case "bot": {
            return bot;
        }
        
        case "process": {
            return process;
        }
        
        default: {
            throw new Error(`Unknown event: ${event}`);
        }
    }
}

Object.defineProperty(String.prototype, "toProperCase", {
    value() {
        return this.toLowerCase().replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
        });
    }
});