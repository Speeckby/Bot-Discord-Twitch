import { ApplicationCommandOptionType } from 'discord.js';
import dotenv from 'dotenv' 
dotenv.config({path: "../.env"})
import deepl from 'deepl-node'

export const command = {
    name: "traduction",
    desc: "🈶 Traduire ta phrase",
    dm: false,
    category: "Fonction",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "langue",
            description: "Raison du ban",
            required : true ,
            choices : [
                {
                    name : "Anglais",
                    value : "en-US"
                },
                {
                    name : "Français",
                    value : "fr"
                },
            ]
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "Message",
            required : true ,
        }
    ],
}

export async function run(client, interaction, args) {
    let final_lang = args.getString('langue')
    let message = args.getString('message')

    const translator = new deepl.Translator(process.env.Deeplkey);

    (async () => {
        const result = await translator.translateText(message, 'fr',final_lang);
        interaction.reply(`**Message de base :** ${message}\n**Message traduit :** ${result.text}`)
    })();
}
