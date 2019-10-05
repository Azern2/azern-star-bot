const { Constants, Command } = require("../../../index.js");
const util = require("util");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            group: "developer",
            format: "<...code>",
            memberName: "eval",
            description: "Evaluates text as code",
            guarded: true,
            ownerOnly: true,
            aliases: ["e"],
            throttling: { usages: 1, duration: 1.5 },
            args: [{
                key: "code",
                type: "string",
                prompt: "What would you like to evaluate?",
                wait: 60
            }]
        });
    }
  
    async run(message, { code }) {
        let cleanInput = code.replace(/^`{3}\w+|`{3}$/g, "");
        if (code.includes("await") && !code.includes("async")) {
            code = `(async () => {${cleanInput}})()`;
        }
      
        try {
            let result = eval(code); // eslint-disable-line no-eval
          
            if (typeof result !== "string") {
                if (result && typeof result.then === "function") {
                    result = await result;
                }
              
                result = util.inspect(result, {
                    depth: 0,
                    maxArrayLength: 50
                });
            }
          
            message.code("js", result).catch((err) => {
                return message.code("js", err);
            });
            message.react(Constants.EMOJIS.BLUE_CHECK).catch(() => {});
        } catch (e) {
            return message.say("```js\n" + e + "```");
        }
    }
};