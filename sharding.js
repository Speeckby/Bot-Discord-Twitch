const { fork } = require('child_process');
require('dotenv').config({ path: "./.env" });

const serviceUPTIMEROBOT = require('./managers/uptimerobot');
const app = require('express')();
serviceUPTIMEROBOT(app);
app.listen(process.env.PORT, () => {});




process.on("unhandledRejection", (e) => { console.error(e) });
process.on("uncaughtException", (e) => { console.error(e) });
process.on("uncaughtExceptionMonitor", (e) => { console.error(e) });

const childProcess = fork("start.js");
childProcess.on('exit', (code) => {
    console.log(`index.js a terminé avec le code de sortie ${code}`);
});
