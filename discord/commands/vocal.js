const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const gtts = require("gtts");

module.exports = {
    name: "vocal",
    desc: "🔊 Créer un message vocal",
    dm: false,
    category: "Fonction",
    perms: null,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "Le message à dire en vocal",
            required: true
        }
    ],

    async run(client, interaction, args) {
        language = 'fr'
        
        textSpeech = new gtts(text=args.getString("message"), lang=language)
        textSpeech.save('fichiers/message.mp3', function (err, result) {
            if(err) { throw new Error(err) }
            interaction.reply({ files: ['fichiers/message.mp3'] })
          });
    }
}