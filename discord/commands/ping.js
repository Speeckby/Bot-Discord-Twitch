module.exports = {
    name: "ping",
    desc: "Obtenir le ping 🏓 du bot",
    usage: "/ping",
    dm: true,
    category: "Information",
    perms: null,

    async run(client, interaction, args) {
        interaction.reply(`Pong 🏓! Mon ping est de ${client.ws.ping} ms !`)
    }
}