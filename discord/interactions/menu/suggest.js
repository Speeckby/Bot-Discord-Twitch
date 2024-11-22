const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
module.exports = {
    run: async(client,interaction) => {
        const modal = new ModalBuilder()
			.setCustomId(`suggest.${interaction.values[0]}`)
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