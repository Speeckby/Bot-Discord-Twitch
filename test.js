const { fork } = require('child_process');
const filesToRun = ['discord/index.js'];//'twitch/main.js',
const {loadavg, cpus, totalmem} = require("os");
const {text} = require('figlet');

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

for (const file of filesToRun) {
  const childProcess = fork(file);
  childProcess.on('exit', (code) => {
    console.log(`${file} a terminé avec le code de sortie ${code}`);
  });
}
