'use strict';

const Command = require("../../structure/Command.js");
let reponse = "erreur";

class On extends Command {
    constructor() {
        super({
            name: 'on',
            category: 'jeux',
            description: 'Oui ou non ?',
            usage: 'on',
            example: ['on Es-tu beau ?'],
            aliases: ['on']
        });
    }
    
    async run(client, channel) {
        let calcul = Math.floor(Math.random() * (8 - 1)) + 1;
        if (calcul == 1) {
            reponse = "Oui bien sûr !"
        }else if (calcul == 2) {
            reponse = "Non pas du tout !"
        }else if (calcul == 3) {
            reponse = "Je ne crois pas !"
        }else if (calcul == 4) {
            reponse = "Je sais pas !"
        }else if (calcul == 5) {
            reponse = "À toi de chercher !"
        }else if (calcul == 6) {
            reponse = "Oui c'est évident !"
        }else if (calcul == 7) {
            reponse = "Non mdrr t'as cru ? "
        }else {
            reponse = "Oui, possible !"
        };
        client.say(channel, reponse);
    }
}
module.exports = new On;