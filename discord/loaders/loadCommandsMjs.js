const fs = require('fs');

module.exports = async (client) => {
  client.fn.log(client, "LOADERS", "Loading Commands Mjs");

  try {
    const files = fs.readdirSync('./discord/commands').filter(f => f.endsWith('.mjs'));

    for (const file of files) {
      try {
        const { command } = await import(`../commands/${file}`);
        if (!command.name || typeof command.name !== 'string') {
          throw new TypeError(`La commande du fichier ${file} n'a pas de nom`);
        }
        client.commands.set(command.name, command);
      } catch (error) {
        console.error(`Erreur lors du chargement de la commande ${file}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du dossier de commandes: ${error.message}`);
  }
};
