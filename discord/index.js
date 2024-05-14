const Discord = require('discord.js')
require('dotenv').config({path: "./.env"})
const intents = new Discord.IntentsBitField(3276799)

const loadFunctions = require("./loaders/loadFunctions.js")
const loadEvents = require("./loaders/loadEvents.js")

const client = new Discord.Client({intents})

client.login(process.env.TOKEN_TEST)
client.commands = new Discord.Collection()
client.color = "#a14ca8"

loadFunctions(client)
loadEvents(client)


//process.on("unhandledRejection", (e) => { client.fn.crash(client,e) })
//process.on("uncaughtException", (e) => { client.fn.crash(client,e) })
//process.on("uncaughtExceptionMonitor", (e) => { client.fn.crash(client,e) })
