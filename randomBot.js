const mineflayer = require('mineflayer');
const http = require('http');

// --- RAILWAY HEALTH CHECK ---
// Railway requires your app to bind to process.env.PORT, otherwise the deployment fails.
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ChaosBot is alive and running!\n');
});
server.listen(PORT, () => {
  console.log(`Railway health check server listening on port ${PORT}`);
});

// --- BOT CONFIGURATION ---
// We pull configuration securely from Railway Environment Variables
const botOptions = {
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT || '25565'),
  username: process.env.MC_USERNAME || 'ChaosBot',
};

console.log(`Connecting to ${botOptions.host}:${botOptions.port} as ${botOptions.username}...`);
const bot = mineflayer.createBot(botOptions);

const controls = ['forward', 'back', 'left', 'right', 'jump', 'sprint', 'sneak'];

bot.on('spawn', () => {
  console.log('Bot has successfully spawned. Commencing chaos...');

  setInterval(() => {
    // Clear previous keys
    bot.clearControlStates();

    // Pick 1 to 3 random actions to press simultaneously
    const numberOfActions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numberOfActions; i++) {
      const randomAction = controls[Math.floor(Math.random() * controls.length)];
      bot.setControlState(randomAction, true);
    }

    // Completely random camera snaps
    const randomYaw = Math.random() * Math.PI * 2;
    const randomPitch = (Math.random() * Math.PI) - (Math.PI / 2);
    bot.look(randomYaw, randomPitch, true);

  }, 800); 
});

// --- LOGGING & ERROR HANDLING ---
bot.on('error', (err) => console.error('Mineflayer Error:', err));
bot.on('kicked', (reason) => console.log('Bot was kicked. Reason:', reason));
bot.on('end', () => console.log('Bot disconnected. Attempting to terminate process...'));
