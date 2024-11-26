//const sql = require("sqlite3")

module.exports = async (client, user) => {
    // Ajout du membre dans la db
    try {            
        const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        // Utilisation d'une promesse pour attendre la fin des opérations asynchrones
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(`SELECT * FROM profil WHERE id = ?`, user.id, async (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                    }

                    if (rows && rows.length > 0) {
                        return ;    
                    } else {
                        db.run(`INSERT INTO profil (name, id) VALUES (?, ?)`,user.globalName, user.id);
                        db.run(`INSERT INTO xp (profil_id) VALUES (?)`,user.id);
                        resolve();
                    }
                });
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