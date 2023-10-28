const fs = require('fs')
const {blue} = require('colors')

module.exports = async (client) => {
    
    client.fn = new Object()
    
    fs.readdirSync("./discord/functions")
    .filter(f => f.endsWith(".js"))
    .forEach(async file => {

        let fonction = require(`../functions/${file}`)
        client.fn[file.split('.')[0]] = fonction
        console.log(blue(`[setup] command ${file} load`))
        
    })
}