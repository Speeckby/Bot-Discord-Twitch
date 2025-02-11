const { createConnection } = require("mysql");

module.exports = class Database {
    constructor(host, user, password, database, port, bot) {
        this.bot = bot
        this.connection = createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
            port: port
        });
        this.connection.connect((err) => {
            if (err) {
                console.error(err);
            } else {
                this.bot.fn.log(this.bot, "starting", "DATABASE", "Connexion à la base de données effectuée !")
            }
        });
    }

    getDiscordUser(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "SELECT * FROM utilisateur_discord WHERE idDiscord = ?",
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "SELECT", `Requête à la table utilisateur_discord effectuée !`));
    }

    getTwitchUser(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "SELECT * FROM utilisateur_twitch WHERE idTwitch = ?",
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "SELECT", `Requête à la table utilisateur_twitch effectuée !`));
    }

    getMotusUser(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "SELECT * FROM motus INNER JOIN utilisateur_discord ON motus.idDiscord = utilisateur_discord.idDiscord WHERE utilisateur_discord.idDiscord = ?",
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0]);
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "SELECT", `Requête à la table motus effectuée !`));
    }

    addDiscordUser(id, name, xp= 0, hex=null, banner=null) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "INSERT INTO utilisateur_discord (idDiscord, name, xp, hex, banner) VALUES (?, ?, ?, ?, ?)",
                [id, name, xp, hex, banner],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "INSERT", `Insertion dans la table utilisateur_discord effectuée !`));
    }    

    addMotusUser(id, easy=0, normal=0, hard=0, harder=0, defaites=0) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "INSERT INTO motus (idDiscord, easy, normal, hard, harder, defaites) VALUES (?, ?, ?, ?, ?, ?)",
                [id, easy, normal, hard, harder, defaites],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "INSERT", `Insertion dans la table motus effectuée !`));;;
    }

    addTwitchUser(id, pseudo, uptime=0, xp=0, dateFollow=null, message=0, estPrincipal=false, idDiscord=null) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "INSERT INTO utilisateur_twitch (idTwitch, pseudo, uptime, xp, dateFollow, message, estPrincipal, idDiscord) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [id, pseudo, uptime, xp, dateFollow, message, estPrincipal, idDiscord],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "INSERT", `Insertion dans la table utilisateur_twitch effectuée !`)); 
    }

    async deleteUserDiscord(id) {
        await this.connection.query(
            "DELETE FROM utilisateur_twitch WHERE idDiscord = ?",
            [id]
        );
        await this.connection.query(
            "DELETE FROM motus WHERE idDiscord = ?",
            [id]
        )
        await this.connection.query(
            "DELETE FROM affichage WHERE idDiscord = ?",
            [id]
        )
        return new Promise((resolve, reject) => {
            this.connection.query(
                "DELETE FROM utilisateur_discord WHERE idDiscord = ?",
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "DELETE", `Suppression dans la table utilisateur_discord effectuée !`));
    }

    deleteUserTwitch(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "DELETE FROM utilisateur_twitch WHERE idTwitch = ?",
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    addBadge(nom, description) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                "INSERT INTO badge (nomBadge, descBadge) VALUES (?, ?)",
                [id, nom, description],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "INSERT", `Insertion dans la table badge effectuée !`));
    }

    async updateValue(table, params, values, id, idName) {
        let str;
        for (let i = 0; i < params.length; i++) {
            str = str ? str + ", " + params[i] + " = ?" : params[i] + " = ?";
        }
        return new Promise((resolve, reject) => {
            this.connection.query(
                "UPDATE " + table + " SET " + str + " WHERE " + idName + " = ?",
                [...values, id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        }).then(this.bot.fn.log(this.bot, "db", "UPDATE", `Mise à jour de la table ${table} effectuée !`));
    }

    close() {
        this.connection.end();
        this.bot.fn.log(this.bot, "ending", "DATABASE", "Connexion à la base de données fermée !")
    }
};