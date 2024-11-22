const sql = require("sqlite3");
const fetch = require("node-fetch");


module.exports = async function(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Code d\'autorisation non trouvé.');
  }
  try {
    const accessToken = await obtenirJeton(code);
    // Récupérer les connexions de l'utilisateur
    const user = await obtenirUtilisateur(accessToken);
    const connections = await obtenirConnexionsUtilisateur(accessToken);

    // Enregistrer les connexions dans la base de données
    let pseudo_twitch = [];
    for (let i = 0; i < connections.length; i++) {
      if (connections[i].type === "twitch") {
        pseudo_twitch.push(connections[i].name);
      }
    }

    const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    await new Promise((resolve, reject) => {
      db.serialize(() => {
        if (pseudo_twitch.length > 1) {
          db.run(`UPDATE profil SET twitch_accounts = ? WHERE id = ?`, [pseudo_twitch.join(','), user.id], (err) => {
            if (err) {
              console.error(err.message);
              return reject(err);
            }
            resolve();
          });
        } else if (pseudo_twitch.length === 1) {
          db.run(`UPDATE profil SET twitch_account = ? WHERE id = ?`, [pseudo_twitch[0], user.id], (err) => {
            if (err) {
              console.error(err.message);
              return reject(err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
    // Rediriger l'utilisateur vers cette page
    res.redirect("https://discord.gg/fEEYpj6CAR");
  } catch (error) {
    console.error('Erreur lors de l\'obtention du jeton:', error);
    res.status(500).send('Erreur serveur.');
  }
}

async function obtenirJeton(code) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.id,
      client_secret: process.env.secret_key,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.URL, // Mettre à jour l'URI ici
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function obtenirConnexionsUtilisateur(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me/connections', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const connections = await response.json();
  return connections;
}

async function obtenirUtilisateur(accessToken) {
  const response = await fetch('https://discord.com/api/users/@me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = await response.json();
  return user;
}