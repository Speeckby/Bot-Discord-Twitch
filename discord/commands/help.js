const Discord = require('discord.js')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: "help",
    desc: "Obtenir de l'aide sur les commandes 🛠",
    usage: "/help commande:[la commande a verifier]",
    dm: true,
    category: "Information",
    perms: null,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "commande",
            description: "La commande a afficher",
            autocomplete: true
        }
    ],

    async run(client, interaction, args) {
        
        let command;
        if (args.getString('commande')) {
            command = client.commands.get(args.getString('commande'))
            if (!command) return client.fn.erreur(interaction, "Cette commande n'existe pas")
        }

        if (!command) {
            let categories = []
            client.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category)
            })

            let embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle("Commandes")
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Commandes du bot"})
            .setDescription(`Nombre de commandes: \`${client.commands.size}\`\nNombre de catégories: \`${categories.length}\``)

            await categories.sort().forEach(async cat => {
                let commands = client.commands.filter(cmd => cmd.category === cat)
                embed.addFields({
                    name: `**${cat}**`,
                    value: `${commands.map(cmd => `\`/${cmd.name}\` : ${cmd.desc}`).join('\n')}`
                })
            })

            interaction.reply({
                embeds: [embed]
            })
        } else {

            let description = [
                `**Nom:** \`${command.name}\``,
                `**Description:** \`${command.desc}\``,
                ``,
                `**Permissions:** ${command.perms === null ? "`Aucune permissions`" : `\`${new Discord.PermissionsBitField(command.perms).toArray(false)}\``}`,
                `**Utilisable en dm:** ${command.dm ? "`✅`" : "`❌`"}`,
                `**Catégorie:** \`${command.category}\``
            ].join('\n')

            let embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Commande ${command.name}`)
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Commandes du bot"})
            .setDescription(description)

            interaction.reply({
                embeds: [embed]
            })
        }

    }
}