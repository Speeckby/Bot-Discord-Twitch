const { response } = require('express');
const erreur = require('./erreur');

let chalks;
import('chalk').then((chalk) => {
    chalks = chalk.default
});

module.exports = async (client, type, subtype, msg) => {

    let reponse = {
        discord: `**[${subtype}]** ${msg} [<t:${parseInt(Date.now()/1000)}:d> <t:${parseInt(Date.now()/1000)}:T> / <t:${parseInt(Date.now()/1000)}:R>]`,
        console: `${new Date().toLocaleString()} [${subtype}] ${msg}`
	}
    switch (type) {
        case "error" : {
            reponse.color = "#ff0000"
            break;
        } case "discord" : {
            reponse.color = "#5865F2"
            break;
        } case "twitch" : {
            reponse.color = "#9146ff"
            break;
        }
        case "starting" : {
            reponse.color = "#afe67c"
            break;
        }
        case "db" : {
            reponse.color = "#becefe"
            break;
        }
        default : {
            reponse.color = "#0dbc79"
            break;
        }
    }

    try {
        client.discord.channels.cache.get(process.env.DiscordConsoleId).send(reponse.discord)
    } catch (error) {
        console.log(chalks.hex("#ff0000") ("Erreur survenue lors de l'envoi d'un log sur discord"))
    }
    console.log(chalks.hex(reponse.color) (reponse.console));
    
}