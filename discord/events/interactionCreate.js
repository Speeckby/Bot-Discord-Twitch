const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;

  // Exécution des commandes
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    try {
      let commandFileName = `${interaction.commandName}`;
      let commandFilePath = path.join(__dirname, '../commands', `${commandFileName}.js`);
      let command;

      if (fs.existsSync(commandFilePath)) {
        command = require(commandFilePath);

        if (typeof command.run === 'function') {
          command.run(client, interaction, interaction.options, client.db);
          client.fn.log(client, 'INFO', `Commande ${interaction.commandName} exécutée par ${interaction.user.tag}`);
        }
      } 
      else if (fs.existsSync(path.join(__dirname, '../commands', `${commandFileName}.mjs`))) {
        const fileURL = new URL(`file://${path.join(__dirname, '../commands', `${commandFileName}.mjs`)}`);
        command = await import(fileURL);
        if (typeof command.run === 'function') {
          command.run(client, interaction, interaction.options, client.db);
          client.fn.log(client, 'INFO', `Commande ${interaction.commandName} exécutée par ${interaction.user.tag}`);
        }

      }
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}: ${error}`);
    }
  }


  // Réponse de modal, boutons et autocomplete
  const handleInteraction = async (interaction, type, folder) => {
    if (interaction.type === type) {
      try {
        let interactionFileName = `${interaction.customId}.js`;
        if (fs.existsSync(path.join(__dirname, `../interactions/${folder}`, interactionFileName))) {
          let file = await import(`../interactions/${folder}/${interactionFileName}`);
          if (typeof file.run === 'function') {
            file.run(client, interaction);
            client.fn.log(client, 'INFO', `${folder.charAt(0).toUpperCase() + folder.slice(1)} ${interaction.customId} traité`);
          }
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de ${folder} ${interaction.customId}: ${error}`);
      }
    }
  };

  handleInteraction(interaction, Discord.InteractionType.ModalSubmit, 'modal');
  handleInteraction(interaction, Discord.InteractionType.Button, 'button');
  handleInteraction(interaction, Discord.InteractionType.ApplicationCommandAutocomplete, 'autocomplete');
};
