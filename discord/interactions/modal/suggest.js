const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
module.exports = {
    run: async(client,interaction) => {
        let color = ""
        let img = ""
        if (interaction.customId.split('.')[1] === 'twitch') {
            color = "#a970ff"
            img = "https://assets.stickpng.com/images/580b57fcd9996e24bc43c540.png"
        }else if (interaction.customId.split('.')[1] === 'discord') {
            color = "#5865f2"
            img = "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png"
        }else if (interaction.customId.split('.')[1] === 'animation') {
            color = "#ffc107"
            img = "https://images.emojiterra.com/google/android-oreo/512px/1f389.png"
        }else if (interaction.customId.split('.')[1] === 'bot') {
            color = "#2fac69"
            img = "https://cdn.discordapp.com/attachments/1099737720026300576/1172441126981087272/icons8-source-code-350_1.png?ex=656053e3&is=654ddee3&hm=21e4928fa015afb4e53f6de20ea80a46f1df1a16390eab716c842da1c49a3150&"
        }else {
            color = "#ffffff"
            img = "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/2753.png"
        }

        const embed = new EmbedBuilder()
            .setTitle(`Nouvelle Suggestion de ${interaction.member.displayName}`)
            .setDescription("> Si vous souhaitez faire des suggestions il vous suffit d'utiliser la commande </suggest:1172233416884895905> ou d'appuyer sur le bouton en bas !")
            .setThumbnail(img)
            .setColor(color)
            .addFields(
                { name : 'Titre :', value : interaction.fields.getTextInputValue('titre')},
                { name : 'Description :', value : interaction.fields.getTextInputValue('description')}
            )
            .setTimestamp()
	        .setFooter({ text: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({ format: 'jpg' }) });
        
        const nouvelle_suggest = new ButtonBuilder()
                .setCustomId('suggest')
                .setLabel('Suggérer une idée')
                .setEmoji('💡')
                .setStyle(ButtonStyle.Primary)
        
        const row = new ActionRowBuilder()
                .addComponents(nouvelle_suggest)
            
        const message = await client.channels.cache.get("1101996211474530324").send({embeds : [embed], components : [row],})
        await interaction.reply({
            content : `<@${interaction.member.id}> Ta suggestion a été prise en compte ! `,
            ephemeral : true
        })
        message.react('✅');
        message.react('✖');

    }
}