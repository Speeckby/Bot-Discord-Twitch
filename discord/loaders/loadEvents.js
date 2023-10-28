const fs = require('fs')
const {blue} = require('colors')

module.exports = async (client) => {
    
    fs.readdirSync("./discord/events")
    .filter(f => f.endsWith(".js"))
    .forEach(async file => {

        let event = require(`../events/${file}`)

        client.on(file.split('.js').join(''), event.bind(null, client))

        console.log(blue(`[setup] event ${file} load`))

    })
}