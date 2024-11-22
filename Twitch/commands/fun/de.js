'use strict';

const Command = require("../../structure/Command.js");

class Dice extends Command {
    constructor() {
        super({
            name: 'dé',
            category: 'jeux',
            description: 'Joue au dé',
            usage: 'dé',
            example: ['dé'],
            aliases: ['dé']
        });
    }

    async run(client, channel) {
        client.say(channel, `Tu as obtenu : ${Math.floor(Math.random() * 6) + 1}`)
    }
}

module.exports = new Dice;