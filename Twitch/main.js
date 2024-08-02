const {client} = require('tmi.js'),
    {green,red} = require('colors'),
    { readdirSync } = require('fs'),
    { join } = require("path"),
    config = require("./config.json")

class Bot extends client {
    constructor(opts) {
        super(opts);
        this.prefix = '!';
        this.config = require('./config.json');
        //Reload Command Function
        /**
         * @param {String} reload_command - Command file name without .js
         * @return {Promise<String>}
         */
        this.reloadCommand = function(reload_command) {
            return new Promise((resolve) => {
                const folders = readdirSync(join(__dirname, "commands"));
                for (let i = 0; i < folders.length; i++) {
                    const commands = readdirSync(join(__dirname, "commands", folders[i]));
                    if (commands.includes(`${reload_command}.js`)) {
                        try {
                            delete require.cache[require.resolve(join(__dirname, "commands", folders[i], `${reload_command}.js`))]
                            const command = require(join(__dirname, "commands", folders[i], `${reload_command}.js`));
                            this.commands.delete(command.name)
                            this.commands.set(command.name, command);
                            console.log(green(`[Commands] Reloaded ${reload_command}`))
                            resolve(`${reload_command} has been reloaded`)
                        } catch (error) {
                            console.log(`${red('[Commands]')} Failed to load command ${reload_command}: ${error.stack || error}`)
                            resolve(`${reload_command} had a problem on reloading!`)
                        }
                    }
                }
                resolve("> Command not found!")
            })
        }
        /**
         * @param {String} reload_event - Event file name without .js
         * @return {Promise<String>}
         */
        this.reloadEvent = function(reload_event) {
            return new Promise((resolve) => {
                const files = readdirSync(join(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        const fileName = e.split('.')[0];
                        if (fileName === reload_event) {
                            const file = require(join(__dirname, "events", e));
                            const res = this.listeners(fileName)
                            this.off(fileName, res[0]);
                            this.on(fileName, file.bind(null, this));
                            delete require.cache[require.resolve(join(__dirname, "events", e))];
                            resolve(`Reloaded ${reload_event}`)
                        }
                    } catch (error) {
                        throw new Error(`${red('[Events]')} Failed to load event ${e}: ${error.stack || error}`)
                    }
                });
                resolve(`Event named: ${reload_event} not found`)
            })
        }
        try {
            this.launch().then(() => { console.log(green('All is launched, Connecting to Twitch...')); })
        } catch (e) {
            throw new Error(e)
        }
        this.connect();
    }
    async launch() {
        this.commands = new Map();
        this._commandsHandler();
        this._eventsHandler();
        this._processEvent();
    }

    _commandsHandler() {
        let count = 0;
        const folders = readdirSync(join(__dirname, "commands"));
        for (let i = 0; i < folders.length; i++) {
            const commands = readdirSync(join(__dirname, "commands", folders[i]));
            count = count + commands.length;
            for(const c of commands){
                try {
                    const command = require(join(__dirname, "commands", folders[i], c));
                    this.commands.set(command.name, command);
                } catch (error) {
                    console.log(`${red('[Commands]')} Failed to load command ${c}: ${error.stack || error}`)
                }
            }
        }
        console.log(`${green('[Commands]')} Loaded ${this.commands.size}/${count} commands`)
    }

    _eventsHandler() {
        let count = 0;
        const files = readdirSync(join(__dirname, "events"));
        files.forEach((e) => {
            try {
                count++;
                const fileName = e.split('.')[0];
                const file = require(join(__dirname, "events", e));
                this.on(fileName, file.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "events", e))];
            } catch (error) {
                throw new Error(`${red('[Events]')} Failed to load event ${e}: ${error.stack || error}`)
            }
        });
        console.log(green(`[Events] Loaded ${count}/${files.length} events`))
    }

    _processEvent() {
        process.on('unhandledRejection', error => {
            if(error.code === 50007) return
            console.error(green('✅ An Error has occured : ') + red(error.stack));
            let details = `\`\`\`\nName : ${error.name}\nMessage : ${error.message}`
            if (error.path) details += `\nPath : ${error.path}`
            if (error.code) details += `\nError Code : ${error.code}`
            if (error.method) details += `\nMethod : ${error.method}`
            if (this.users) this.users.cache.get(this.config.owner.id).send({
                embed: {
                    description: `🔺 **An Error has occured:**\n\`\`\`js\n${error}\`\`\``,
                    color: this.maincolor,
                    fields: [
                        {
                            name: "🔺 Details :",
                            value: `${details}\`\`\``
                        }
                    ]
                }
            })
        });
    }
}
new Bot({
    identity: {
        username: config.username,
        password: config.password
    },
    channels: config.channels
})