const dateformat = require("dateformat");
const chalk = require("chalk");
const util = require("util");

class Logger {
    constructor(time) {
        this.timestamp = time;
    }
  
    get time() {
        return `[${dateformat(this.timestamp || Date.now(), "mediumTime")}]`;
    }
  
    log(...args) {
        console.log(`${this.time} ${Logger.clean(args)}`);
    }
  
    info(...args) {
        console.info(chalk.cyan(`${this.time} ${Logger.clean(args)}`));
    }
  
    debug(...args) {
        console.debug(chalk.green(`${this.time} ${Logger.clean(args)}`));
    }
  
    warn(...args) {
        console.warn(chalk.yellow(`${this.time} [WARN] ${Logger.clean(args)}`));
    }
  
    error(...args) {
        console.error(chalk.red(`${this.time} ${Logger.clean(args)}`));
    }
  
    custom(color, ...args) {
        console.info(chalk[color](`${this.time} ${Logger.clean(args)}`));
    }
  
    static clean(args) {
        return args.map((arg) => {
            if (arg instanceof Error) {
                return arg.stack;
            } else if (typeof arg === "object") {
                return util.inspect(arg);
            }
 
            return arg;
        }).join(" ");
    }
}

module.exports = Logger;