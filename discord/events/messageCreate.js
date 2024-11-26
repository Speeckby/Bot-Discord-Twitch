const { toInteger } = require("lodash");
//const sql = require("sqlite3")


function calcul_xp (taille, coeff_channel, level, xp, xp_requis, xp_total) {
    let new_xp = toInteger(4*taille/10*Math.log(taille)/Math.sqrt(taille) * coeff_channel)
    xp += new_xp

    while (xp > xp_requis ) {
        level += 1
        xp -= xp_requis
        xp_requis = (level * 6) * level + 100
    }

    return { xp : xp, level : level, xp_requis : xp_requis, xp_total : new_xp + xp_total }
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
                db.all(`SELECT * FROM profil JOIN xp ON profil.id = xp.profil_id WHERE profil_id = ? `, message.author.id, async (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                    }
                    if (rows && rows.length > 0) {
                        let { xp, level, xp_requis, xp_total } = calcul_xp(taille, coeff_channel, rows[0].level, rows[0].xp_level, rows[0].xp_requis, rows[0].xp_total)
                        await db.run(`UPDATE profil SET name = ? WHERE id = ?`, [message.author.globalName, message.author.id]);
                        await db.run(`UPDATE xp SET xp_total = ?, level = ?, xp_level = ?, xp_requis = ? WHERE profil_id = ?`, [xp_total, level, xp, xp_requis, message.author.id ] );
                    } else {
                        let { xp, level, xp_requis, xp_total } = calcul_xp(taille, coeff_channel, 0, 0, 100)
                        await db.run(`INSERT INTO profil (name, id) VALUES (?, ?)`, [message.author.globalName, message.author.id]);
                        await db.run(`INSERT INTO xp (profil_id, xp_total, level, xp_level, xp_requis) VALUES (?, ?, ?, ?, ?)`, [message.author.id, xp_total, level, xp, xp_requis ] );
                    }
                });
            });
        });

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
}       