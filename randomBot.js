const mineflayer = require('mineflayer');
const http = require('http');

// --- RAILWAY HEALTH CHECK ---
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ChaosBot Deployment is Online\n');
}).listen(PORT, () => {
  console.log(`[Railway] Health check listening on port ${PORT}`);
});

// --- BOT CONFIGURATION ---
const botOptions = {
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT || '25565'),
  username: process.env.MC_USERNAME || 'ChaosBot',
  auth: 'offline', 
  // If MC_VERSION is not provided in Railway, it will attempt to auto-detect the version.
  version: process.env.MC_VERSION || false 
};

if (botOptions.version) {
  console.log(`[Diagnostic] Connecting to ${botOptions.host}:${botOptions.port} using forced version ${botOptions.version}...`);
} else {
  console.log(`[Diagnostic] Connecting to ${botOptions.host}:${botOptions.port} with auto-version detection...`);
}

const bot = mineflayer.createBot(botOptions);

// --- CONNECTION DIAGNOSTIC LOGS ---
bot.on('connect', () => {
  console.log('[Success] Connected to server network socket. Syncing protocol handshake...');
});

bot.on('login', () => {
  console.log('[Success] Logged into server proxy. Waiting to spawn into world...');
});

const controls = ['forward', 'back', 'left', 'right', 'jump', 'sprint', 'sneak'];

bot.on('spawn', () => {
  console.log('[Success] Bot safely spawned in-world! Commencing chaos loop...');

  setInterval(() => {
    bot.clearControlStates();

    const numberOfActions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numberOfActions; i++) {
      const randomAction = controls[Math.floor(Math.random() * controls.length)];
      bot.setControlState(randomAction, true);
    }

    const randomYaw = Math.random() * Math.PI * 2;
    const randomPitch = (Math.random() * Math.PI) - (Math.PI / 2);
    bot.look(randomYaw, randomPitch, true);

  }, 800); 
});

// --- ERROR TRACKING ---
bot.on('error', (err) => {
  console.error('[Error Details]:', err.message);
});

bot.on('kicked', (reason) => {
  console.log('[Kicked from Server]. Reason:', JSON.stringify(reason));
});

bot.on('end', () => {
  console.log('[Disconnected] Bot was disconnected from the server.');
});
