'use strict';

const Command = require("../../structure/Command.js");

class ReloadCmd extends Command {
    constructor() {
        super({
            name: 'reload-event',
            category: 'utils',
            description: 'Reload an event',
            usage: 'reload-event <event-file-name-without.js>',
            example: ['reload-event connected', 'reload-event message'],
            perms: "owner"
        });
    }

    async run(client, channel, content, user, args) {
        if(!args[1]) {
            return client.say(channel, `@${user.username}, No event specified!`)
        } else {
            args.shift();
            client.reloadEvent(args.join(" ")).then((res) => {
                client.say(channel `@${user.username}, ${res}`)
            })
        }
    }
}

module.exports = new ReloadCmd;