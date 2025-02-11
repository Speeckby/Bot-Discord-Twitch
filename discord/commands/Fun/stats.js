const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    name: "stats",
    desc: "Obtenir tes stats au motus",
    usage: "/stats",
    options: [{
        type: ApplicationCommandOptionType.User,
        name: "utilisateur",
        description: "Utilisateur à regarder",
        required : false 
    }],

    async run(client, interaction, args) {
        await interaction.deferReply();
        let user = null
        if (args.getUser('utilisateur')) {
            user = await client.users.fetch(args.getUser('utilisateur'))
        }else {
            user = interaction.user
        }

        let data;
        data = await client.db.getDiscordUser(user.id)
        if (data == undefined) {
            interaction.editReply({content: `L'utilisateur <@${user.id}> n'a pas encore joué au motus !`, ephemeral: true})
            return ;
        }

        let vd = 0
        if (data.defaites ==0 ) {
            vd = data.victoires
        }else {
            vd = data.victoires / data.defaites
        }
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Stats du motus de ${user.username} :`,
            })
            .addFields(
                {
                name: " ",
                value: `**Défaites** : ${data.defaites} \n**Victoires** : ${data.victoires} \n**V/D** : ${vd.toFixed(2)}`,
                inline: false
                },
                {
                name: " ",
                value: `<:easy:1171552071577767966> **Easy** : ${data.easy}\n<:hard:1171552066838200351> **Difficile** : ${data.hard}`,
                inline: true
                },
                {
                name: " ",
                value: `<:normal:1171552069329621102> **Normal** : ${data.harder}\n<:harder:1171860842489335839> **Très difficile** : ${data.harder}`,
                inline: true
                },
            )
            .setThumbnail(user.displayAvatarURL({ format: 'jpg' }))
            .setColor(client.color)
        
        interaction.editReply({embeds : [embed]})
    }
}