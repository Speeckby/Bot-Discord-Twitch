const {green} = require('colors')
module.exports = async(client, addr, port) => {
    console.log(`${green('[BOT]',`Connecté à ${addr}:${port}`)}`);
    console.log(`${green('[BOT]', `Connecté en tant que ${client.twitch.username}`)}`)
}