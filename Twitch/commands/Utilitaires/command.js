const fs = require("fs");
const Command = require("../../../structure/command.js");

module.exports = {
    name: 'command',
    desc: 'Créer une commande',
    aliases: ['cmd'],
    usage: 'cmd <add|rm|edit> <nom> <nouvelle commande>',
    example: "cmd add coucou Hello World !",
    run: async(client, channel, user, args) => {
        
        if (args.length < 2) return await client.twitch.say(channel, `⚙️ Le type de la commande n'a pas été fournie (add, rm, edit)!`);
        if (args.length < 3) return await client.twitch.say(channel, `⚙️ Le nom de la commande concernée n'a pas été fourni !`);
        if (args.length < 4 && args[1] != "rm") return await client.twitch.say(channel, `⚙️ La réponse envoyée par la commande n'a pas été fournie !`);

        // Initialisation des variables
        let nom = args[2];

        // La réponse
        switch (args[1]) {
            case "add":
                if (fs.existsSync(`twitch/commands/Custom/${nom}.js`)) {
                    client.twitch.say(channel, `⚙️ La commande ${nom} existe déjà !`);
                    return ;
                } else {
                    fs.appendFile(`twitch/commands/Custom/${nom}.js`,`module.exports = {
    name: '${nom}',
    desc: 'Dire ${args[3]}',
    usage: '!${nom}',
    run: async(client, channel, user, args) => {
        client.twitch.say(channel, '${args[3]}')
    }
}`, 
                    function (err) {
                            if (err) throw err;
                            delete require.cache[require.resolve(`../Custom/${nom}.js`)];
                            const cmd = require(`../Custom/${nom}.js`);
                            client.twitch.commands.set(cmd.name, new Command(cmd))
                            client.twitch.say(channel, `⚙️ Commande ${nom} ajoutée !`);
                        }
                    );
                }
                break;
            case "rm":
                if (!fs.existsSync(`twitch/commands/Custom/${nom}.js`)) {
                    client.twitch.say(channel, `⚙️ La commande ${nom} n'existe pas !`);
                    return ;
                } else {
                    fs.unlinkSync(`twitch/commands/Custom/${nom}.js`);
                    client.twitch.commands.delete(nom);
                    client.twitch.say(channel, `⚙️ Commande ${nom} supprimée !`);
                }
                break;
            case "edit":
                if (!fs.existsSync(`twitch/commands/Custom/${nom}.js`)) {
                    client.twitch.say(channel, `⚙️ La commande ${nom} n'existe pas !`);
                    return ;
                } else {
                    client.twitch.commands.delete(nom);
                    fs.writeFile(`twitch/commands/Custom/${nom}.js`, `module.exports = {
    name: '${nom}',
    desc: 'Dire ${args[3]}',
    usage: '!${nom}',
    run: async(client, channel, user, args) => {
        client.twitch.say(channel, '${args[3]}')
    }
}`, 
                    function (err) {
                            if (err) throw err;
                            delete require.cache[require.resolve(`../Custom/${nom}.js`)];
                            const cmd = require(`../Custom/${nom}.js`);
                            client.twitch.commands.set(cmd.name, new Command(cmd))
                            client.twitch.say(channel, `⚙️ Commande ${nom} modifiée !`);
                        }
                    )
                }
                break;
            default:
                client.twitch.say(channel, `⚙️ Le paramètre fourni n'existe pas (add, rm, edit)!`);
                return ;
        }
    }
}
