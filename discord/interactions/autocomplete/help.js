const Discord = require('discord.js')

module.exports = async (client, interaction, entry) => {

    let choices = client.commands.filter(cmd => cmd.name.includes(entry))
    let reply = (entry === "" ? client.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))
    if (reply.length>25) {
        let size = reply.length
        reply = reply.slice(0, 24)
        reply.push({name: `Et ${size-24} autres ...`, value: "-"})
    }
    await interaction.respond(reply)

}