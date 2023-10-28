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
            example: ['cmd add !test dit test'],
            aliases: ['cmd']
        });
    }
    
    async run(client, channel, args) {
        // Initialisation des variables
        let a = 5;
        let classe = "";
        let reponse = '';
        let nom = "";
        let caractère = "";
        // Le caractère
        for (a; args[a] != " "; a+=1) {
            caractère += args[a];
        };
        // Le nom
        for (a+=2; args[a] != " "; a+=1) {
            nom += args[a];
        };
        // La réponse
        if (chara)
        reponse += '"';
        for (a+1; a < args.length ; a+=1) {
            reponse += args[a];
        };
        reponse+= '"'; 
        if (isNaN(nom[0]) == false) {
            classe += "a";
            classe += nom;
        } else {
            classe += nom;
        }
        fs.appendFile(`./commands/create/${nom}.js`,`
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
            client.say(channel, `⚙️ Commande ${nom} créée !`)});
            } 
        }
module.exports = new Test;