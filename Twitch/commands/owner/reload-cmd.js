'use strict';

const Command = require("../../structure/Command.js");

class ReloadCmd extends Command {
    constructor() {
        super({
            name: 'reload-cmd',
            category: 'utils',
            description: 'Reload a command',
            usage: 'reload-cmd <command-file-name-without.js>',
            example: ['reload-cmd dice', 'reload-cmd ban'],
            perms: "owner"
        });
    }

    async run(client, channel, content, user, args) {
        if(!args[1]) {
            return client.say(channel, `@${user.username}, No command specified!`)
        } else {
            args.shift();
            client.reloadCommand(args.join(" ")).then((res) => {
                client.say(channel `@${user.username}, ${res}`)
            })
        }
    }
}

module.exports = new ReloadCmd;