'use strict';

const Command = require("../../structure/Command.js");

class Raconte extends Command {
    constructor() {
        super({
            name: 'raconte',
            category: 'fun',
            description: 'Raconte pas ta vie',
            usage: 'ban <username> <reason>',
            example: ['r arvix', 'r @arvix'],
            aliases: ['r']
        });
    }

    async run(client, channel, user, args) {
        if(!args[1]) {
            return client.say(channel, `@${user.username},Veuillez spécifer un utilisateur !`)
        } else {
            const target = args[1].replace("@",'');
            args.shift(); args.shift();
            client.say(channel, `Raconte pas ta vie @${target} stp :)! (Signé ${user.username})`)
        }
    }
}

module.exports = new Raconte;