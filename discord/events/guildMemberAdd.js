const sql = require("sqlite3")

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
                db.all(`SELECT * FROM profil WHERE id = ?`, user.user.id, (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                        return;
                    }

                    if (rows && rows.length > 0) {
                        return ;    
                    } else {
                        db.run(`INSERT INTO profil (name, id, xp) VALUES (?, ?, ?)`,user.user.globalName, user.user.id, 0);
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