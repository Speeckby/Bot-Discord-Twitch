const { fork } = require('child_process');
require('dotenv').config({path: "./.env"})
const {loadavg, cpus, totalmem} = require("os");
const {text} = require('figlet');
const app = require('express')();
const fs = require('fs');
const cors = require('cors');

const cpuCores = cpus().length;
    //Custom Starting Message
    text('SpeeckBot', {
        font: "Standard"
    }, function(err, data) {
        if (err) {
            console.log('Bizarre ... une erreur ');
            console.dir(err);
            return;
        }
        const data2 = data;
        text('By : Speeckby', {
        }, function(err, data) {
            if (err) {
                console.log('Bizarre ... une erreur ');
                console.dir(err);
                return;
            }
            console.log("================================================================================================================================"+"\n"+
                data2+"\n\n"+ data +"\n"+
                "================================================================================================================================"+ "\n"+
                `CPU: ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100%` + "\n" +
                `RAM: ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB` + "\n" +
                "================================================================================================================================"
            );
        });

    });

// Lancement de twitch et discord

fork("twitch/main.js");
fork("discord/index.js");

//Gestion du site web
app.use(cors());
app.use(async (req, res, next) => {
    let requestedPage = req.path;
    switch (requestedPage) {
        case "/":
            res.send('hi');
            break;
        default : 
            const filePath = (require('path')).join(__dirname, `website/${requestedPage.split('?')[0]}`);
            // Vérifier si le fichier existe
            if (fs.existsSync(filePath) && !requestedPage.startsWith('/js/')) {
                // Si le fichier existe, l'envoyer en réponse
                res.sendFile(filePath);
            } else if (fs.existsSync(filePath+'.html')) {
                // Si le fichier existe, l'envoyer en réponse
                res.sendFile(filePath+'.html');
            } else if (requestedPage.startsWith('/js/') && fs.existsSync(filePath)) {
                const file = require(filePath);
                file(req, res);
            } else {
                console.log(requestedPage + "err")
                // Sinon, renvoyer une erreur 404
                res.status(404).sendFile(__dirname + '/website/404.html');
            }
            break;
    }
});

app.listen(process.env.PORT, () => {});

process.on("unhandledRejection", (e) => { console.error(e) });
process.on("uncaughtException", (e) => { console.error(e) });
process.on("uncaughtExceptionMonitor", (e) => { console.error(e) });