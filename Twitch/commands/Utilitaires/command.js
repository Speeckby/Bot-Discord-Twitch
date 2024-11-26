const fs = require("fs");

module.exports = {
    name: 'command',
    desc: 'Créer une commande',
    aliases: ['cmd'],
    usage: 'cmd <add|rm|edit> <nom> <nouvelle commande>',
    example: "cmd add coucou Hello World !",
    run: async(client, channel, user, args) => {

        if (args.length < 4) return await client.twitch.say(channel, `⚙️ La réponse envoyée par la commande n'a pas été fournie !`);
        
        // Initialisation des variables
        let classe = "";
        let nom = args[2].split("!")[1];
        let param = args[1];
        let reponse = '';

        // La réponse
        switch (param) {
            case "add":
                console.log(args)
                caractère = "⚙️ Commande ajoutée !";
                break;
            case "rm":
                caractère = "⚙️ Commande supprimée !";
                break;
            case "edit":
                caractère = "⚙️ Commande modifiée !";
                break;
            default:
                client.twitch.say(channel, `⚙️ Le paramètre fourni n'existe pas !`);
                return ;
        }
        if (args.length > 3) {
            reponse += '"';
            for (let a = 3; a < args.length ; a+=1) {
                reponse += args[a] + " ";
            };
            reponse+= '"'; 
        }else {
        client.twitch.say(channel, `⚙️ La réponse envoyée par la commande n'est pas été fournie !`);
        return ; 
        }
        if (isNaN(nom[0]) == false) {
            classe += "a";
            classe += nom;
        } else {
            classe += nom;
        }
        fs.appendFile(`twitch/commands/Custom/${nom}.js`,`

module.exports = {
    name: '${nom}',
    category: 'fun',
    description: '${reponse}',
    usage: '${nom}',
    run : async (client, channel) => {
        client.twitch.say(channel, "${caractère}")
    }
}`,
        function (err) {
            if (err) throw err;
            console.log('Fichier créé !');
            client.reloadCommand(nom).then((res) => {
                client.twitch.say(channel, `⚙️ Commande ${nom} créée !`)
            });
        })
    }
}
