const { toInteger } = require("lodash");
const sql = require("sqlite3")


function calcul_xp (taille, coeff_channel) {
    return toInteger(4*taille/10*Math.log(taille)/Math.sqrt(taille)) * coeff_channel
}
module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === "DM") return;
    const taille = message.content.length
    if (taille == 0) return ;
    else {
        let coeff_channel = 1
        no_xp =  [1071353814348734464]
        little_xp = [942830584579891210,1055579149764411432,1074062031713484912]
        if (no_xp.includes(message.channel.id)) {
            return ;
        } else if (little_xp.includes(message.channel.id) || message.channel.type == 2 ) {
            coeff_channel = 0.3
        }
        const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        // Utilisation d'une promesse pour attendre la fin des opérations asynchrones
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(`SELECT * FROM profil WHERE id = ?`, message.author.id, (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                    }

                    if (rows && rows.length > 0) {
                        const xp = rows[0].xp + calcul_xp(taille, coeff_channel)
                        db.run(`UPDATE profil SET xp = ? WHERE id = ?`, xp, message.author.id, (err) => {
                            if (err) {
                                console.error(err.message);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        db.run(`INSERT INTO profil (name, id, xp) VALUES (?, ?, ?)`,message.author.globalName, message.author.id, calcul_xp(taille, coeff_channel));
                    }
                });
            });
        });
    }
}       