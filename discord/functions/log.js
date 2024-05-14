const {blue} = require('colors')

module.exports = async (client, type, msg) => {
    
    let reponse = {
        discord: `**[${type}]** ${msg} [<t:${parseInt(Date.now()/1000)}:d> <t:${parseInt(Date.now()/1000)}:T> / <t:${parseInt(Date.now()/1000)}:R>]`,
        console: blue(`[${type}] ${msg}`)
	}
    client.channels.cache.get(process.env.DiscordConsoleId).send(reponse.discord)
    console.log(reponse.console)
    
}