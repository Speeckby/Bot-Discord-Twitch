const sql = require("sqlite3");
//const url = 'https://wapi.wizebot.tv/api/channels/b15cd6759a16e81a8ef42fc01a34d82e65820f7cce21218a33095aa6c5158e4a/datas'; 
const uptime = 'https://wapi.wizebot.tv/api/ranking/b15cd6759a16e81a8ef42fc01a34d82e65820f7cce21218a33095aa6c5158e4a/top/uptime/global/all';
const level = 'https://wapi.wizebot.tv/api/ranking/b15cd6759a16e81a8ef42fc01a34d82e65820f7cce21218a33095aa6c5158e4a/top/levels/false';
const message = 'https://wapi.wizebot.tv/api/ranking/b15cd6759a16e81a8ef42fc01a34d82e65820f7cce21218a33095aa6c5158e4a/top/message/global/all';

fetchViewersStats()
async function fetchViewersStats() {
  await request(uptime, 'uptime');
  await request(message, 'message');
  await request(level, 'level');
  await fetchTopViewers();
}
function request(url, category) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
      })
      data.list
        .forEach(item => {
          db.serialize(() => {
            let id = item.user_uid
            if (category === 'level') id = item.user_id
            db.all(`SELECT * FROM twitch WHERE id = ?`, [id], (err, rows) => {
              if (err) {
                console.error(err.message);
              }
              if (rows && rows.length > 0) {
                db.run(`UPDATE twitch SET ${category} = ? WHERE id = ?`, [item.value, id])
              } else {
                db.run(`INSERT INTO twitch (pseudo, id, ${category}) VALUES (?, ?, ?)`, [item.user_name, id, item.value])
              }
            })
          })
        })
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

async function fetchTopViewers() {
  const url = 'https://speeckby.streaming.lv/ajax/list/top_viewers.php?t=b0dff67e146bfb02beef7141cb83423f4db4236701bd6e928adf710da31b9dc9&top_categ=rank&top_period=week&draw=2&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=250&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1724099392549';

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Cookie': 'wizebot_network=fv5t7ncjgqo7glcn4tbkn92ls3',
          }
      });

      let data = await response.json(); 
      data = data.data

      const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
          if (err) {
              console.error(err.message);
          }
      })
      data.forEach(item => {
        db.serialize(() => {
          db.all(`SELECT * FROM twitch WHERE pseudo = ?`, item[1].toLowerCase(), (err, rows) => {
              if (err) {
                console.error(err.message);
              }

              if (rows && rows.length > 0) {
                db.run(`UPDATE twitch SET level = ?, xp = ? WHERE pseudo = ?`, item[2], item[4], item[1].toLowerCase())
              } else {
                console.log(item[1].toLowerCase() + ' not in database')
              }
          })
        })
      })
  } catch (error) {
      console.error('Erreur lors de la récupération des données:', error.message);
  }
}
