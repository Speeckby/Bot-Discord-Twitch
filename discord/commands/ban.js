const Discord = require('discord.js')
const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: "ban",
    desc: "Bannir un membre",
    dm: false,
    category: "Modération",
    perms: PermissionFlagsBits.BanMembers,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Membre a bannir",
            required: true
        }, {
            type: ApplicationCommandOptionType.String,
            name: "raison",
            description: "Raison du ban"
        }
    ],

    async run(client, interaction, args) {
        try {
            let user = await client.users.fetch(args.getUser('membre').id)
            if (!user) return client.fn.erreur(interaction, "Membre non trouvé !")
            let member = interaction.guild.members.cache.get(user.id)

            let raison = args.getString('raison')
            if (!raison) raison = "Aucune raison fourni"

            
            if (interaction.user.id == client.user.id) return client.fn.erreur(interaction, "Tu ne peux pas me ban !")
            if (interaction.user.id == user.id) return client.fn.erreur(interaction, "Tu ne peux pas te bannir toi-même !")
            if ((await interaction.guild.fetchOwner()).id === interaction.id) return client.fn.erreur(interaction, "Tu ne peux pas bannir le propriétaire du serveur !")
            //if (!member.bannable) return erreur(interaction, "Je ne peux pas bannir ce membre !")
            if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return client.fn.erreur(interaction, "Tu ne peux pas bannir ce membre !")
            if ((await interaction.guild.bans.fetch()).get(user.id)) return client.fn.erreur(interaction, "Ce membre est déja ban !")
            try {
                let msg = [
                    `**Rapport de banissement :**`,
                    ``,
                    `Tu as été banni du serveur **${interaction.guild.name}** par \`${interaction.user.tag}\``,
                    `Raison: ${raison}`
                ]
                user.send(msg.join('\n'))
            } catch {}

            interaction.reply({
                content: `**[BAN]** ${interaction.user} a banni \`${user.tag}\`\nRaison: ${raison}`
            })

            interaction.guild.bans.create(user.id, {reason: raison})
        } catch(e) {
            console.error(e)
            return client.fn.erreur(interaction, "Membre non trouvé !")
        }
    }
}