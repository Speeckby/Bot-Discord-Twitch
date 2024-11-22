const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
    run : async(client, interaction) => {  
		const select = new StringSelectMenuBuilder()
			.setCustomId('suggest')
			.setPlaceholder('Faire une suggestion !')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Twitch')
                    .setDescription("Suggestion pour la chaine Twitch c'est ici !")
                    .setEmoji('<:twitch:1172592012122406952>')
					.setValue('twitch'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Discord')
                    .setDescription('Des suggestions pour le discord ?')
                    .setEmoji('<:discord:1172592009941373060>')
					.setValue('discord'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Animations')
					.setDescription('Si tu as des animations à suggérer !')
                    .setEmoji('<:animation:1172591969910927501>')
					.setValue('animation'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Bot')
					.setDescription('A propos des bots discord et Twitch !')
                    .setEmoji('<:developper:1172591950944276562>')
					.setValue('bot'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Autre')
                    .setEmoji('❓')
					.setDescription("Quelque chose que j'ai pas cité au dessus ?")
					.setValue('autre'),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

        await interaction.reply({
			content: `<@${interaction.member.id}> Je te laisse choisir le thème !`,
			components: [row],
            ephemeral: true
		});
	},
};