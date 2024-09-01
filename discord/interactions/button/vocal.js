const { PermissionsBitField } = require('discord.js');

module.exports = {
    run : async(client, interaction) => {
		const paramètre = interaction.customId.split('.')[1];
        if (interaction.user.id != client.vocal[interaction.channel.id]) return interaction.reply({ ephemeral: true, content: "<@" + interaction.user.id + "> Vous n'avez pas la permission de modifier ce vocal !" })
        switch (paramètre) {
            case "name": {
                await interaction.reply({
                    ephemeral: true,
                    content: "Entrez le nouveau nom de votre vocal, mettez ``cancel`` pour annuler:",
                })

                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30_000 });
                collector.on('collect', async m => {
                    if (m.content == 'cancel') {
                        await interaction.editReply({ content: "La procédure a été annulée !" });
                        return ;
                    }
                    await interaction.channel.setName(m.content),
                    await m.reply({ephemeral: true, content: "Le nom du vocal a été changé en ``" + m.content + "`` !" });
                });
                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await interaction.editReply({ content: "Le temps est écoulé (sois plus rapide) !" });
                    }
                });
                break;
            } case "capacity": {
                await interaction.reply({
                    ephemeral: true,
                    content: "Entrez la nouvelle capacité de votre vocal (entre 2 et 99 ou inf), mettez ``cancel`` pour annuler:",
                })
                const filter = m => m.author.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30_000 });
                collector.on('collect', async m => {
                    if (m.content < 2 || m.content > 99 || (isNaN(m.content) && m.content != 'inf')) {
                        await interaction.editReply({ content: "La capacité doit être comprise entre 2 et 99 ou inf !" });
                        return ;
                    }
                    if (m.content == 'cancel') {
                        await interaction.editReply({ content: "La procédure a été annulée !" });
                        return ;
                    }
                    await interaction.channel.setUserLimit(m.content);
                    m.content == 'inf' ? m.content = 0 : m.content
                    await m.reply({ephemeral: true, content: "La capacité du vocal a été changée en ``" + m.content + "`` membres !" });
                });
                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await interaction.editReply({ content: "Le temps est écoulé (sois plus rapide) !" });
                    }
                });
                break;
            } case "private" : {
                if (interaction.channel.permissionOverwrites.cache.get(interaction.guild.id).allow.has(PermissionsBitField.Flags.Connect)) {
                    await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, {
                        [PermissionsBitField.Flags.Connect]: false
                    });
                    await interaction.reply({ephemeral: true, content: "Le mode de votre vocal a été changé en ``privé`` !" });
                    return;
                } else {
                    await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, {
                        [PermissionsBitField.Flags.Connect]: true
                    });
                    await interaction.reply({ephemeral: true, content: "Le mode de votre vocal a été changé en ``public`` !" });
                    return;
                }
            } case "delete" : {
                if (client.vocal[interaction.channel.id]) delete client.vocal[interaction.channel.id];
                await interaction.channel.delete();
                return;
            }
        }   
	},
};