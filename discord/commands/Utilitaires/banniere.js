const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "banniere",
    desc: "Changer la bannière de ton profil",
    usage: "/bannière",
    options: [
        {
            name: "lien",
            description: "Changer la bannière de ton profil par une image",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "couleur",
            description: "Changer la bannière de ton profil par une couleur",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    async run(client, interaction, args) {
        const link = args.getString('lien');
        let color = args.getString('couleur');
        const reg = /^#([0-9a-f]{3}){1,2}$/i;

        // Créez une promesse pour chaque opération avec la base de données
        const db = new sqlite3.Database('discord/stockage.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        function dbGet(query, params = []) {
            return new Promise((resolve, reject) => {
                db.get(query, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }

        function dbRun(query, params = []) {
            return new Promise((resolve, reject) => {
                db.run(query, params, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        try {
            if ((color || link) && !(color && link)) {
                if (link) {
                    if ((link.startsWith('https://i.imgur.com/') && link.endsWith('.png')) ||
                        (link.startsWith('https://cdn.imgchest.com/files/') && link.endsWith('.png'))) {

                        let row = await dbGet(`SELECT * FROM profil WHERE id = ?`, [interaction.user.id]);

                        if (row) {
                            await dbRun(`UPDATE profil SET banner = ? WHERE id = ?`, [link, interaction.user.id]);
                        } else {
                            await dbRun(`INSERT INTO profil (name, id, banner) VALUES (?, ?, ?)`,
                                [interaction.user.globalName, interaction.user.id, link]);
                        }

                        interaction.reply(`La bannière a bien été changée !`);

                    } else {
                        interaction.reply(`Le lien n'est pas valide (/bannière pour les infos) !`);
                    }

                } else {
                    color = color.startsWith('#') ? color : `#${color}`;

                    if (reg.test(color)) {

                        let row = await dbGet(`SELECT * FROM profil WHERE id = ?`, [interaction.user.id]);

                        if (row) {
                            await dbRun(`UPDATE profil SET hex = ? WHERE id = ?`, [color, interaction.user.id]);
                        } else {
                            await dbRun(`INSERT INTO profil (name, id, hex) VALUES (?, ?, ?)`,
                                [interaction.user.globalName, interaction.user.id, color]);
                        }

                        interaction.reply(`La couleur de la bannière a bien été changée !`);
                    } else {
                        interaction.reply(`La couleur n'est pas valide (/bannière pour les infos) !`);
                    }
                }
            } else if (!link && !color) {
                interaction.reply(`**Changer sa bannière de profil :** \n\n - Mettre une image : \n\n __Pré-requis :__ Être sub à la chaine ou booster du serveur.\nVous devez effectuer la commande **'/banniere'** et mettre dans le paramètre **lien** un lien direct vers votre image en png hébergée sur imgur ou imgchest. \n\n - **Mettre une couleur :** \n\n Vous devez effectuer la commande **'/banniere'** et mettre dans le paramètre **couleur** une couleur valide en hexadecimal.`);
            } else {
                interaction.reply(`Veuillez ne pas mettre deux paramètres en même temps !`);
            }

        } catch (err) {
            console.error("Erreur SQL:", err);
            interaction.reply("Une erreur s'est produite lors du traitement de votre demande.");
        } finally {
            db.close((err) => {
                if (err) console.error(err.message);
            });
        }
    }
}
