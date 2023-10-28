'use strict';

const Command = require("../../structure/Command.js");

class Ban extends Command {
    constructor() {
        super({
            name: 'ban',
            category: 'moderation',
            description: 'Bannir un utilisateur',
            usage: 'ban <username> <reason>',
            example: ['ban arvix Spam in chat', 'ban @arvix Spam in chat'],
            perms: "mod"
        });
    }

    async run(client, channel, user, args) {
        if(!args[1]) {
            return client.say(channel, `@${user.username},Veuillez spécifer un utilisateur !`)
        } else {
            const target = args[1].replace("@",'');
            args.shift(); args.shift();
            client.ban(channel, target, args.join(" ")).then(res => {
                client.say(channel, `@${user.username}, L'utilisateur ${target} à été banni de la chaine`)
            }).catch((e) => {
                client.say(channel, `@${user.username}, Une erreure à été rencontrée ! ${e.error}`)
            })

        }
    }
}

module.exports = new Ban;