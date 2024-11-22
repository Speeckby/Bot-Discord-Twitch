const fs = require('fs')

module.exports = async (client) => {

    client.fn.log(client, "LOADERS", `loading Commands`)
    
    fs.readdirSync("./discord/commands")
    .forEach(async folders => {
        fs.readdirSync(`./discord/commands/${folders}`)
        .filter(f => f.endsWith(".js"))
        .forEach(async file => {
            let command = require(`../commands/${folders}/${file}`)
            if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande du fichier ${file} n'a pas de nom`);
            client.commands.set(command.name, command)   
        })
    })
}