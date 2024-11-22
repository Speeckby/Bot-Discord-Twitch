const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: "demande",
    desc: "Dis à un membre qu'on lui a pas demandé 😴",
    usage: "/demande",
    dm: false,
    category: "Fun",
    perms: null,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "L'utilisateur qui raconte sa vie 😴",
            required: true
        }
    ],

    async run(client, interaction, args) {
        try {
            let user = await client.users.fetch(args.getUser('membre').id)
            if (!user) return client.fn.erreur(interaction, "Membre non trouvé !")
            interaction.reply(`On a pas demandé ${user} 🤓👆 !`)
        }catch(e) {
            console.error(e)
            return client.fn.erreur(interaction, "Membre non trouvé !")
        }
    }
}