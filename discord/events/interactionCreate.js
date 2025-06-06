const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (client, interaction) => {

  if (interaction.user.bot) return;
  // Exécution des commandes
  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    try {
      let commandFileName = `${interaction.commandName}`;
      if (client.discord.commands.get(commandFileName)) {
        let commandFilePath = path.join(__dirname, `../commands/${client.discord.commands.get(commandFileName).category}`, `${commandFileName}.js`);
        let command;
        command = require(commandFilePath);

        if (typeof command.run === 'function') {
          command.run(client, interaction, interaction.options, client.db);
          client.fn.log(client, 'discord', "DISCORD", `Commande ${interaction.commandName} exécutée par ${interaction.user.tag}`);
        }
      } 
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}: ${error}`);
    }
  }


  // Réponse de modal, boutons et autocomplete
  const handleInteraction = async (interaction) => {
    if (interaction.isModalSubmit()) {
      
      let file = await import(`../interactions/modal/${interaction.customId.split('.')[0]}.js`)
      file.run(client, interaction);
      client.fn.log(client, "discord", "DISCORD", `modal ${interaction.customId.split('.')[0]} utilisé par ${interaction.user.tag}`);

    } else if (interaction.isButton()) {
      if (!fs.existsSync(path.join(__dirname, '../interactions/button/', `${interaction.customId.split('.')[0]}.js`))) {
        return
      }
      let file = await import(`../interactions/button/${interaction.customId.split('.')[0]}.js`)
      file.run(client, interaction);
      client.fn.log(client, "discord", "DISCORD", `button ${interaction.customId.split('.')[0]} utilisé par ${interaction.user.tag}`);
      
    } else if (interaction.isStringSelectMenu()) {
      let file = await import(`../interactions/menu/${interaction.customId.split('.')[0]}.js`)
      file.run(client, interaction);
      client.fn.log(client, "discord", "DISCORD", `menu ${interaction.customId.split('.')[0]} utilisé par ${interaction.user.tag}`);
      
    } else if (interaction.isAutocomplete()) {
      let file = await import(`../interactions/autocomplete/${interaction.commandName}.js`)
      file.run(client, interaction, interaction.options.getFocused());
    }
  };

  handleInteraction(interaction);
};
