const Discord = require('discord.js')

module.exports = async (client) => {
    
    client.fn.log(client, "STARTING", `------------------`)
    client.fn.log(client, "STARTING", `Bot loading starts`)
    client.fn.log(client, "LOADERS", `loading Functions`)
    client.fn.log(client, "LOADERS", `loading Events`)

    client.discord.user.setPresence({ 
        activities: [{ 
            name: 'twitch.tv/speeckby', 
            type: Discord.ActivityType.Streaming, 
            url: 'https://twitch.tv/speeckby' 
        }], 
        status: 'online'
    });
    
    await client.loadCommands()
    await client.loadSlashCommands()
    
    setTimeout(() => {
        client.fn.log(client, "LOADERS", `${client.discord.user.tag} online`)
    }, 4000)
}