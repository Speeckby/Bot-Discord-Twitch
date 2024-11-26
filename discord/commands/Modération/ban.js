const Discord = require('discord.js')
const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: "ban",
    desc: "Bannir un membre ",
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
        }, {
            type: ApplicationCommandOptionType.String,
            name: "temps",
            description: "Temps en précisant l'unité (sec par défaut)"
        }
    ],

    async run(client, interaction, args) {
        function timeout(temps) {
            if (temps[temps.length-1] == "c") {
                temps = temps.split('s')
                let user = args.getMember('membre')
                if (temps[0] > 2419000000) {
                    return undefined
                }
                user.timeout(temps[0] * 1000)
                return "secondes"
            }else if (temps[temps.length-1] == "n") {
                temps = temps.split('m')
                let user = args.getMember('membre')
                if (temps[0] > 40320) {
                    return undefined
                }
                user.timeout(temps[0] * 60000)
                return "minutes"
            }else if (temps[temps.length-1] == "h") {
                temps = temps.split('h')
                let user = args.getMember('membre')
                if (temps[0] > 672) {
                    return undefined
                }
                user.timeout(temps[0] * 3600000)
                return "heures"
            }else if (temps[temps.length-1] == "d") {
                temps = temps.split('d')
                let user = args.getMember('membre')
                if (temps[0] > 28) {
                    return undefined
                }
                user.timeout(temps[0] * 86400000)
                return "jours"
            }
        }
        try {
            let temps = args.getString('temps')

            let user = await client.users.fetch(args.getUser('membre').id)
            if (!user) return client.fn.erreur(interaction, "Membre non trouvé !")

            let raison = args.getString('raison')
            if (!raison) raison = "Aucune raison fourni"

            let member = interaction.guild.members.cache.get(user.id)

            if (interaction.user.id == client.user.id) return client.fn.erreur(interaction, "Tu ne peux pas me ban !")
            if (interaction.user.id == user.id) return client.fn.erreur(interaction, "Tu ne peux pas te bannir toi-même !")
            if ((await interaction.guild.fetchOwner()).id === interaction.id) return client.fn.erreur(interaction, "Tu ne peux pas bannir le propriétaire du serveur !")
            if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return client.fn.erreur(interaction, "Tu ne peux pas bannir ce membre !")

            if (!temps) {
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
            } else {
                temps = temps.split(' ')
                if (temps.length == 1 && isNaN(temps[0][temps[0].length-1])) {
                    val = timeout(temps[0])
                } else if (temps.length >= 2) {
                    val = timeout(temps[0] + temps[1])
                } else {
                    let user = args.getMember('membre')
                    user.timeout(temps[0] * 1000)
                    val = "secondes"
                }
                if (val == undefined) {
                    return client.fn.erreur(interaction, "Tu ne peux pas TO plus de 28 jours !")
                } else {
                    interaction.reply({
                        ephemeral : true,
                        content: `**[TO]** ${interaction.user} a exclu <@${user.id}> \`pendant ${temps[0]} ${val}.\`\n  Raison: ${raison}`
                    })
                }
            }

        } catch(e) {
            console.error(e)
            return client.fn.erreur(interaction, "Membre non trouvé !")
        }
    }
}