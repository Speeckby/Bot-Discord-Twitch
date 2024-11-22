const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: "vocal",
    desc: "Changer les paramètres du vocal",
    usage: "/vocal",
    dm: false,
    category: "Utilitaires",
    perms: null,

    async run(client, interaction, args) {
        let user = false 
        for (elm in client.vocal) {
            if (client.vocal[elm] == interaction.user.id) {
                user = elm
            }
        } 
        if (!user) {
            await interaction.reply("Tu n'es pas propriétaire d'un vocal actuellement !")
            return null
        } else {
            if (user != interaction.channelId) {
                await interaction.reply("Tu dois effectuer cette commande dans le vocal concerné !")
                return null
            } else {
                const rows = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.name`)
                        .setLabel("Changer le nom")
                        .setEmoji("📝"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.capacity`)
                        .setLabel("Changer la capacité")
                        .setEmoji("👥"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.private`)
                        .setLabel("Changer le mode privé")
                        .setEmoji("🔒"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(`vocal.delete`)
                        .setLabel("Supprimer")
                        .setEmoji("🗑️"),
                )
                await interaction.reply({ ephemeral : true, content : `<@${interaction.user.id}>`, embeds : [new EmbedBuilder()
                    .setTitle(`Paramètres du salon vocal :`)
                    .setDescription("Voici les paramètres du salon que vous pouvez changer en utilisant la commande /vocal ou en réagissant aux boutons suivants:")
                    .addFields(
                        { name: "Nom :", value: `${interaction.channel.name}`, inline: true },
                        { name: "Capacité :", value: `${interaction.channel.members.size} / ${interaction.channel.userLimit===0 ? "∞" : interaction.channel.userLimit} membres`, inline: true },
                        { name: "Privé :", value: `${interaction.channel.permissionOverwrites.cache.get(interaction.guild.id).allow.has(PermissionFlagsBits.Connect) ? "Oui" : "Non"}`, inline: true },
                    )
                    .setColor(client.color)], components : [rows]}
                )
            }
        }
    }
}