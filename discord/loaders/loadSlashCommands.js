const Discord = require('discord.js')
const { ApplicationCommandType } = require('discord.js')

module.exports = async client => {

    client.fn.log(client, "LOADERS", `loading SlashCommands`)

    let commands = []
    client.commands.forEach(async command => {

        commands.push({
            name: command.name,
            description: command.desc,
            options: command.options || null,
            type: ApplicationCommandType.ChatInput,
            defaultMemberPermissions: command.perms || null,
            dmPermission: command.dm || false
        });

    })

    await client.application.commands.set(commands)

}