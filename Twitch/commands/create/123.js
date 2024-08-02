'use strict';
const Command = require("../../structure/Command.js");

class a123 extends Command {
    constructor() {
        super({
            name: '123',
            category: 'fun',
            description: 'Dire qqchose',
            usage: '123'
        });
    };

    async run(client, channel) {
        client.say(channel, "M A L A I S E");
    };
};

module.exports = new a123;