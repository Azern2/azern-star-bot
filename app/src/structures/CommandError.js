const Command = require("./Command.js");

class CommandError {
    static EMISACC(message, perm = "perform this action", shouldFormat = true) {
        if (shouldFormat) {
            return message.say(`You do not have permission to \`${Array.isArray(perm)
                ? Command.cleanPermissions(perm, "`, `")
                : perm}\``).then((msg) => msg.delete({ timeout: 8000 }));
        }
      
        return message.say(`You do not have permission to ${Array
            .isArray(perm) ? Command.cleanPermissions(perm, "`, `") : perm}`).then((msg) => {
            return msg.delete({ timeout: 8000 });
        });
    }
  
    static ERR_INVALID(message, label) {
        return message.say(`Invalid ${label}`);
    }
  
    static ERR_NOT_FOUND(message, type, label) {
        if (label) {
            return message.say(`No ${type} named "${label}" found.`).then((msg) => {
                return msg.delete({ timeout: 6000 });
            });
        }
      
        return message.say(`${type.toProperCase()} not found.`).then((msg) => {
            return msg.delete({timeout: 6000});
        });
    }
  
    static ERR_MISSING_PERMS(message, perm = "perform this action") {
        if (Array.isArray(perm)) {
            return message.say(`You do not have permission to \`${Command
                .cleanPermissions(perm, "`, `")}\``).then((msg) => msg.delete({timeout: 7000}));
        }
      
        return message.say(`You do not have permission to ${perm}`).then((msg) => {
            return msg.delete({timeout: 7000});
        });
    }
  
    static ERR_CLIENT_ERR(message, api) {
        return message.say(`There seems to be a problem with the ${api}. Try again later?`);
    }
}

module.exports = CommandError;