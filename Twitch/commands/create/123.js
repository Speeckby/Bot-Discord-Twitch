
'use strict';
const Command = require("../../structure/Command.js");

class a123 extends Command {
    constructor() {
        super({
            name: '123',
            category: 'fun',
            description: 'Dire qqchose',
            usage: '123 <username> <reason>'
        });
    };

    async run(client, channel, user, args) {
        client.say(channel, "M A L A I S E");
    };
};

module.exports = new a123;