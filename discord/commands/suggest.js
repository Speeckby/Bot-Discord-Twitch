const { ModalBuilder, ApplicationCommandOptionType, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require('discord.js')

module.exports = {
    name: "suggest",
    desc: "Suggérer une idée ",
    dm: false,
    category: "Informations",
    perms: null, 
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "categorie",
            description: "Catégorie de la suggestion",
            required : true ,
            choices : [
                {
                    name : "Twitch",
                    value : "twitch"
                },
                {
                    name : "Discord",
                    value : "discord"
                },
                {
                    name : "Bot",
                    value : "bot"
                },
                {
                    name : "Animation",
                    value : "animation"
                },
                {
                    name : "Autre",
                    value : "autre"
                },
            ]
        },
    ],

    async run(client, interaction, args) {
        const modal = new ModalBuilder()
			.setCustomId(`suggest.${args.getString("categorie")}`)
			.setTitle('Suggestion');
        
        
        const titre = new TextInputBuilder()
			.setCustomId('titre')
			.setLabel("Titre rapide de ta suggestion ")
			.setStyle(TextInputStyle.Short);
        
        const description = new TextInputBuilder()
			.setCustomId('description')
			.setLabel("En quoi consiste ta suggestion ?")
			.setStyle(TextInputStyle.Paragraph);
        
        const titre_row = new ActionRowBuilder().addComponents(titre);
        const description_row = new ActionRowBuilder().addComponents(description);

        modal.addComponents(titre_row,description_row);
        await interaction.showModal(modal);

    }
}