module.exports = {
    name: "ping",
    desc: "Obtenir le ping 🏓 du bot",
    usage: "/ping",

    async run(client, interaction, args) {
        interaction.reply(`Pong 🏓! Mon ping est de ${client.discord.ws.ping} ms !`)
    }
}