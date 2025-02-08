const Discord = require('discord.js')

module.exports = async (client) => {
    
    client.fn.log(client, "starting", "STARTING", `------------------`)
    client.fn.log(client, "starting", "LOADERS", `Bot loading starts`)
    client.fn.log(client, "starting", "DISCORD", `loading Functions`)
    client.fn.log(client, "starting", "DISCORD", `loading Events`)

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
        client.fn.log(client, "starting", "DISCORD", `${client.discord.user.tag} online`)
    }, 4000)
}