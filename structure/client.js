const { createConnection } = require('mysql'),
    { ApplicationCommandType, Client: DiscordClient, Collection} = require('discord.js'),
    { client: TwitchClient} = require('tmi.js'),
    { readdirSync } = require('fs'), 
    Command = require('./command.js');

module.exports = class Bot {
    constructor() {
        this.discord = new DiscordClient({
            intents: 3276799
        });

        this.twitch = new TwitchClient({
            identity: {
                username: process.env.TwitchPseudo,
                password: process.env.TwitchPassword
            },
            channels: process.env.TwitchChannels.split(","),
        });
        this.twitch.prefix = "!";

        this.vocal = {}
        this.color = "#a14ca8"


        this.loadFunctions();
        //this.db = this.loadDatabase();
    }

    async start() {
        this.loadEvents();
        await this.discord.login(process.env.TOKEN);
        await this.twitch.connect();
    }

    loadDatabase() {
        let db = createConnection({
            host: process.env.DBhost,
            user: process.env.DBuser,
            password: process.env.DBpassword,
            database: process.env.DBdatabase,
            port: process.env.DBport
        })
    
        db.connect(function(e) {
            if (e) return crash(client, e)
            this.fn.log(client, "starting", "DATABASE", `loading Database`)
        })
    
        return db
    }

    loadFunctions() {
        this.fn = new Object()
        readdirSync("./global/functions")
            .filter(f => f.endsWith(".js"))
            .forEach(async file => {
                let fonction = require(`../global/functions/${file}`)
                this.fn[file.split('.')[0]] = fonction
            })
    }

    loadEvents() {
        readdirSync(__dirname + '/../discord/events').forEach(file => {
            if (file.endsWith('.js')) {
                this.discord.on(file.split('.')[0], require(__dirname + '/../discord/events/' + file).bind(null, this));
            }
        })

        readdirSync(__dirname + '/../twitch/events').forEach(file => {
            if (file.endsWith('.js')) {
                this.twitch.on(file.split('.')[0], require(__dirname + '/../twitch/events/' + file).bind(null, this));
            }
        })
    }

    loadCommands() {
        // Chargement des commandes Discord
        this.discord.commands = new Collection();
        this.fn.log(this, "starting", "DISCORD", `loading Commands`)
        readdirSync("./discord/commands")
        .forEach(async folders => {
            readdirSync(`./discord/commands/${folders}`)
            .filter(f => f.endsWith(".js"))
            .forEach(async file => {
                let cmd = require(`../discord/commands/${folders}/${file}`)
                if (!cmd.name || typeof cmd.name !== "string"  || !cmd.run || typeof cmd.run !== "function" ) throw new TypeError(`La commande du fichier ${file} n'a pas toutes les informations demandées`);
                cmd.category = folders
                this.discord.commands.set(cmd.name, new Command(cmd))
            })
        })

        // Chargement des commandes Twitch
        this.twitch.commands = new Collection();
        this.fn.log(this, "starting", "TWITCH", `loading Commands`)
        readdirSync("./twitch/commands")
        .forEach(async folders => {
            readdirSync(`./twitch/commands/${folders}`)
            .filter(f => f.endsWith(".js"))
            .forEach(async file => {
                let cmd = require(`../twitch/commands/${folders}/${file}`)
                if (!cmd.name || typeof cmd.name !== "string"  || !cmd.run || typeof cmd.run !== "function" ) throw new TypeError(`La commande du fichier ${file} n'a pas toutes les informations demandées`);
                cmd.category = folders
                this.twitch.commands.set(cmd.name, new Command(cmd))
            })
        })
    }

    async loadSlashCommands() {
        this.fn.log(this, "starting", "DISCORD", `loading SlashCommands`)

        let commands = []
        this.discord.commands.forEach(async command => {

            commands.push({
                name: command.name,
                description: command.description,
                options: command.options,
                type: ApplicationCommandType.ChatInput,
                defaultMemberPermissions: command.perms || null,
                dmPermission: false
            });

        })
        await this.discord.application.commands.set(commands)
    }
}