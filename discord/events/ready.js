const Discord = require('discord.js')

const loadSlashCommands = require('../loaders/loadSlashCommands.js')
const loadCommands = require("../loaders/loadCommands.js")
const loadCommandsMjs = require('../loaders/loadCommandsMjs.js')

module.exports = async client => {
    
    client.fn.log(client, "STARTING", `------------------`)
    client.fn.log(client, "STARTING", `Bot loading starts`)
    client.fn.log(client, "LOADERS", `loading Functions`)
    client.fn.log(client, "LOADERS", `loading Events`)

    client.user.setPresence({ 
        activities: [{ 
            name: 'twitch.tv/speeckby', 
            type: Discord.ActivityType.Streaming, 
            url: 'https://twitch.tv/speeckby' 
        }], 
        status: 'online'
    });
    await loadCommands(client)
    await loadCommandsMjs(client)
    await loadSlashCommands(client)
    
    setTimeout(() => {
        client.fn.log(client, "LOADERS", `${client.user.tag} online`)
    }, 4000)

}