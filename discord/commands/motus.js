const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const emotes = require("../../fichiers/emotes.json");
const mots = require('../../fichiers/mots.json');
const wd = require("word-definition");
const sql = require("sqlite3")

module.exports = {
    name: "motus",
    desc: "Joue au motus 🔡",
    usage: "/suttom",
    aliases: ["suttom"],
    dm: true,
    category: "Fun / Jeux",
    perms: null,

    async run(client, interaction) {

        await interaction.deferReply();

        async function donnees(memberid,category,category2 = undefined) {
            try {            

                const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
        
                // Utilisation d'une promesse pour attendre la fin des opérations asynchrones
                await new Promise((resolve, reject) => {
                    db.serialize(() => {
                        db.all(`SELECT * FROM motus WHERE id = ?`, memberid, (err, rows) => {
                            if (err) {
                                console.error(err.message);
                                reject(err);
                                return;
                            }
        
                            if (rows && rows.length > 0) {
        						if (category2 === undefined ) {
                                    const newnumber = rows[0][category] + 1;
                                    db.run(`UPDATE motus SET ${category} = ? WHERE id = ?`, newnumber, memberid, (err) => {
                                        if (err) {
                                            console.error(err.message);
                                            reject(err);
                                        } else {
                                            console.log("Mise à jour réussie !");
                                            resolve();
                                        }
                                	});
                                }else {
                                    const newnumber = rows[0][category] + 1;
                                    const newnumber2 = rows[0][category2] + 1;
                                    db.run(`UPDATE motus SET ${category} = ?, ${category2} = ? WHERE id = ?`, newnumber, newnumber2, memberid, (err) => {
                                        if (err) {
                                            console.error(err.message);
                                            reject(err);
                                        } else {
                                            console.log("Mise à jour réussie !");
                                            resolve();
                                        }
                                    });
                                }
                                
                            } else {
                                 db.run(`INSERT INTO motus (id, ${category}) VALUES (?, ?)`,memberid, 1, (err) => {
                              	   if (err) {
                                      console.error(err.message);
                                        reject(err);
                                    } else {
                                        console.log("Mise à jour réussie !");
                                        resolve();
                                    }
                              	if (category2 != undefined) {
                                   db.run(`UPDATE motus SET ${category2} = 1 WHERE id = ?`, memberid, (err) => {
                                        if (err) {
                                            console.error(err.message);
                                            reject(err);
                                        } else {
                                            console.log("Mise à jour réussie !");
                                            resolve();
                                        }
                                	});
                                }
                            })
                        }});
                    });
                });
        
                // Fermeture de la base de données après que la promesse est résolue
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }




        const removeAccents = str =>
                str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Commencer un motus :")
            .setDescription(`Quel est la difficulté et la taille du mot voulu ? `)

		const easy = new ButtonBuilder()
			.setCustomId('easy')
			.setLabel('10 - 11')
            .setEmoji('<easy:1171552071577767966>')
			.setStyle(ButtonStyle.Primary);

        const normal = new ButtonBuilder()
            .setCustomId('normal')
            .setLabel('7 - 8')
            .setEmoji('<:normal:1171552069329621102>')
            .setStyle(ButtonStyle.Primary);

        const hard = new ButtonBuilder()
            .setCustomId('hard')
            .setLabel('5 - 7')
            .setEmoji("<hard:1171552066838200351>")
            .setStyle(ButtonStyle.Primary);
        
        const harder = new ButtonBuilder()
            .setCustomId('harder')
            .setLabel('3 - 4')
            .setEmoji('<harder:1171860842489335839>')
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);
        

		const row = new ActionRowBuilder()
			.addComponents(harder,hard,normal,easy,cancel);

        const reponse = await interaction.editReply({
            embeds : [embed],
            components: [row],
        });
        
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await reponse.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId != '' && confirmation.customId != 'cancel') {
                
                let mot = mots[confirmation.customId]
                let taille = mot.length
                let rang = parseInt(Math.random() * taille)

                let essai = 0
                let list = []
                taille = mot[rang].length
                ligne = ""
                for (const x of Array(taille).keys()) {
                    ligne = ligne + "⚫"
                }
                let date = Math.floor(Date.now() / 1000) + 600
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Motus :")
                    .setDescription(`🔴 = Lettre bien placée \n🟡 = Lettre mal placée \n 🔵 = Mauvaise lettre \n\n **Jeux : ** \n\n ${ligne} \n\n Tentatives : ${essai}/6 \nTemps avant la fin : <t:${date}:R>\n ${"`cancel`"} pour arrêter la partie`)
                
                confirmation.update({
                    embeds :  [embed],
                    components : [],
                })
                let collector = interaction.channel.createMessageCollector({
                    filter: (message) => message.channelId === interaction.channelId && message.author.id === interaction.member.id,
                    time : 600_000,
                })
                let rep = ''
                let fini = false 
                
                collector.on('collect', (message) => {
                    if (message.content.length === taille && message.content != 'cancel') {

                        wd.getDef(message.content, "fr", null, function(definition) {
                            if(definition.err != undefined) {
                                message.reply({content: `<@${message.member.id}> ton mot n'existe pas.`, ephemeral: true})
                                .then(msg => {
                                    message.delete()
                                    setTimeout(() => msg.delete(), 10000)
                                  })
                                
                            } else {
                                essai += 1
                                let messages = removeAccents(message.content).toLowerCase()
                                rep = ""
                                if (messages!= removeAccents(mot[rang])) {
    
                                    for (let x = 0; x < taille; x++) {
                                        let lettre_message = removeAccents(message.content[x]).toLowerCase()
                            
                                        if (lettre_message === removeAccents(mot[rang][x])) {
                                            rep += emotes.lettres_rouges[lettre_message]
                                        } else if (removeAccents(mot[rang]).includes(lettre_message) === true) {
                                            rep += emotes.lettres_jaunes[lettre_message]
                                        } else {
                                            rep += `:regional_indicator_${lettre_message}:`
                                        }
                                    }
                                    list.push(rep)
                                    rep = ""
                                    for(let x = 0; x < list.length; x++) {
                                        rep += list[x] + "\n"
                                    }
                                    const embed = new EmbedBuilder()
                                        .setColor(client.color)
                                        .setTitle("Motus :")
                                        .setDescription(`🔴 = Lettre bien placée \n🟡 = Lettre mal placée \n 🔵 = Mauvaise lettre \n\n **Jeux : ** \n\n ${rep} \n Tentatives : ${essai}/6 \nTemps avant la fin : <t:${date}:R>\n ${"`cancel`"} pour arrêter la partie`)
    
    
                                    interaction.editReply({
                                        embeds :  [embed],
                                        components : [],
                                    })
                                    if (essai === 6) {
    
                                        fini = true 
                                        collector.stop()
                                        donnees(interaction.member.id,'defaites')
                                        interaction.channel.send({ content: `<@${message.member.id}> tu as perdu car tu as fais toutes tes tentatives, le mot était ${removeAccents(mot[rang])} !`})
                                        
    
                                    }
                                } else {
                                    for (let x = 0; x < taille; x++) {
                                        let lettre_message = removeAccents(message.content[x]).toLowerCase()
                                        rep += emotes.lettres_rouges[lettre_message]
                                    }
                                    list.push(rep)
                                    rep = ""
                                    for(let x = 0; x < list.length; x++) {
                                        rep += list[x] + "\n"
                                    }
                                    const embed = new EmbedBuilder()
                                        .setColor(client.color)
                                        .setTitle("Motus :")
                                        .setDescription(`🔴 = Lettre bien placée \n🟡 = Lettre mal placée \n 🔵 = Mauvaise lettre \n\n **Jeux : ** \n\n ${rep} \nTentatives : ${essai}/6 \nTemps avant la fin : <t:${date}:R>\n ${"`cancel`"} pour arrêter la partie`)
    
                                    interaction.editReply({
                                        embeds :  [embed],
                                        components : [],
                                    })
                                    donnees(interaction.member.id,'victoires',confirmation.customId)
                                    interaction.channel.send({ content: ` GG <@${message.member.id}> tu as gagné en ${essai} essais sur 6 !`})
                                    fini = true 
                                    collector.stop()
                                }
                                message.delete()
                            }
                        })
                    } else if (message.content === 'cancel') {
                        const embed = new EmbedBuilder()
                            .setTitle('Motus')
                            .setColor(client.color)
                            .setDescription(`La partie a été annulée !`)
                        donnees(interaction.member.id,'defaites')
                        interaction.editReply({ embeds : [embed]})
                        fini = true 
                        collector.stop()
                        message.delete()
                    }  else {
                        message.reply({content: `<@${message.member.id}> ton mot n'est pas de la bonne taille.`, ephemeral: true})
                        .then(msg => {
                            message.delete()
                            setTimeout(() => msg.delete(), 10000)
                        })
                    }
                })
        
                collector.on('end', (message) => {
                    if (!fini) {
                        donnees(interaction.member.id,'defaites')
                        interaction.channel.send({ content: `<@${interaction.member.id}> Tu as perdu pour inactivité, le mot était ${removeAccents(mot[rang])} !`})
                    }
                })  
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action annulée', components: [], embeds : [] });

            }
        } catch (e) {
            await interaction.editReply({ content: 'Délai de réponse dépassé', components: [], embeds : [] });
        }
    }
}