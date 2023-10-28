const {get} = require('http');
const https = require('https');
const {URL,URLSearchParams} = require('url');
const mainURL = new URL(process.env.BrainURL);
const config = require("./config.json");
const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

const urlOptions = {
    bid: process.env.BrainID,
    key: process.env.Brainkey,
    uid: null,
    msg: null
};

const handleTalk = async (client, msg) => {
    if (!config.channel.includes(msg.channel.id) && !msg.content.includes("<@1155267880003305523>") ) return;
    msg.content = msg.content.replace(/^<@!?[0-9]{1,20}> ?/i, ''); // Remove any mentions in the message
    msg.channel.sendTyping();
    urlOptions.uid = msg.author.id;
    urlOptions.msg = msg.content;
    mainURL.search = new URLSearchParams(urlOptions).toString();
    const message = await new Promise((resolve, reject) => {
        const req = get(mainURL, requestOptions, (res) => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(new Error(`[${res.statusCode}] Unable to process request: \nReason: ${res.statusMessage}`));
            }
            res.setEncoding('utf8');
            let responseBody = "";
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if(responseBody == "(Time out)") {
                    console.log("bug")
                } else {
                    resolve(JSON.parse(responseBody));
                }
            });

            req.on('error', (err) => {
                reject(new Error(err));
            });

            req.end();
        });
    }).catch(e => {
        console.log('Unable to connect to API: ' + e.stack);
    });

    if (message && message.cnt) {
        reponse = translate("en","fr",message.cnt)
        msg.reply({
            content: reponse,
            allowedMentions: {
                repliedUser: false
            }
        });
    }
};

module.exports = {
    handleTalk,
};