require('dotenv').config({path: "./.env"})
const app = require('express')();
const fs = require('fs');
const Bot = require('./structure/client.js')

const bot = new Bot() 

process.on("unhandledRejection", (e) => { console.error(e) });
process.on("uncaughtException", (e) => { console.error(e) });
process.on("uncaughtExceptionMonitor", (e) => { console.error(e) });

//  Gestion du site web
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
                // Sinon, renvoyer une erreur 404
                res.status(404).sendFile(__dirname + '/website/404.html');
            }
            break;
    }
});
app.listen(process.env.PORT, () => {});

bot.start();