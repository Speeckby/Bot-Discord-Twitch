const mysql = require('mysql')

module.exports = async (client) => {

    let db = mysql.createConnection({
        host: process.env.DBhost,
        user: process.env.DBuser,
        password: process.env.DBpassword,
        database: process.env.DBdatabase,
        port: '3306'
    })

    db.connect(function(e) {
        if (e) return crash(client, e)
        client.fn.log(client, "LOADERS", `loading Database`)
    })

    return db
    
}