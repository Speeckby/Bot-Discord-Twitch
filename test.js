const { fork } = require('child_process');

const filesToRun = ['twitch/main.js','discord/index.js'];

for (const file of filesToRun) {
  const childProcess = fork(file);
  childProcess.on('exit', (code) => {
    console.log(`${file} a terminé avec le code de sortie ${code}`);
  });
}
