'use strict';

const Command = require("../../structure/Command.js");
const fs = require("fs");
let reponse = "erreur";

class Test extends Command {
    constructor() {
        super({
            name: 'command',
            category: 'jeux',
            description: 'Oui ou non ?',
            usage: 'cmd <caractère> !<nom> <action>',
            example: ['cmd add !merde je suis une merde'],
            aliases: ['cmd']
        });
    }
    
    async run(client, channel, user, args) {
        // Initialisation des variables
        let classe = "";
        let nom = args[2].split("!")[1];
        let caractère = args[1];
        let reponse = '';

        // La réponse
        if (args.length > 3) {
            reponse += '"';
            for (let a = 3; a < args.length ; a+=1) {
                reponse += args[a] + " ";
            };
            reponse+= '"'; 
        }else {
           client.say(channel, `⚙️ La réponse envoyée par la commande n'a pas été fournie !`);
           return ; 
        }
        if (isNaN(nom[0]) == false) {
            classe += "a";
            classe += nom;
        } else {
            classe += nom;
        }
        fs.appendFile(`twitch/commands/create/${nom}.js`,`
'use strict';
const Command = require("../../structure/Command.js");

class ${classe} extends Command {
    constructor() {
        super({
            name: '${nom}',
            category: 'fun',
            description: 'Dire qqchose',
            usage: '${nom} <username> <reason>'
        });
    };

    async run(client, channel, user, args) {
        client.say(channel, ${reponse});
    };
};

module.exports = new ${classe};`,
        function (err) {
            if (err) throw err;
            console.log('Fichier créé !');
            client.reloadCommand(nom).then((res) => {
                client.say(channel, `⚙️ Commande ${nom} créée !`)
            });
        })
    }
}
module.exports = new Test;