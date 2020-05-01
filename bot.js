const Discord = require('discord.js');
const dotenv = require('dotenv').config();

const mcServerCheck = require('./utils/mcServerCheck');
const utils = require('./utils/utils');
const config = require('./config/config.json');

const client = new Discord.Client();

const token = process.env.TOKEN;
const mcServerIP = process.env.IP;
const mcServerPort = process.env.PORT;
const craftoApi = process.env.CRAFTOAPIKEY;
const diegoId = process.env.DIEGOID;
const memeChannelID = process.env.MEMECHANNELID;
const prefix = config.global.prefix;

client.status = 'Iniciando Ping...';
client.mcServerMOTD = 'N/A';
client.mcServerVersion = 0;
client.mcServerPlayersOnline = 0;
client.mcServerMaxPlayers = 0;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const loadCommands = () => {
  const fs = require('fs');

  let files = fs.readdirSync(__dirname + '/comandos');

  files.forEach(file => {
    let command = require(`./comandos/${file}`);

    client.commands.set(command.help.name, command);
    
    if (command.help.aliases) {
      command.help.aliases
        .filter(alias => alias.trim() !== '')
        .forEach(alias => client.aliases.set(alias, command.help.name));
    }
  });
};

const loadEvents = () => {
  const fs = require('fs');

  let files = fs.readdirSync(__dirname + '/eventos');

  files.forEach(file => {
    let events = require(`./eventos/${file}`);

    if (!Array.isArray(events)) {
      events = [events];
    }

    events.forEach(event => {
      client.on(event.name, (...args) => event.run(client, ...args));
    })
  })
};

const start = async () => {
  console.log('[INICIALIZAÇÃO] Iniciando...');
  
  await client.login(token).catch(err => console.error('[LOGIN] ', err));

  console.log('[INICIALIZAÇÃO] Carregando eventos...');
  loadEvents();

  console.log('[INICIALIZAÇÃO] Carregando comandos...');
  loadCommands();
  
  console.log('[INICIALIZAÇÃO] Começando intervalo para pings a cada 5 segundos...');
  setInterval(() => {    
    mcServerCheck.start(mcServerPort, mcServerIP, 10, (res) => {
      if (mcServerCheck.isOnline) {
        client.status = `Status do Servidor: Online!`;
        client.mcServerPlayersOnline = mcServerCheck.mcServerCurPlayers;
        client.mcServerMaxPlayers = mcServerCheck.mcServerMaxPlayers;
        client.mcServerVersion = mcServerCheck.mcServerVersion;
        client.mcServerMOTD = mcServerCheck.mcServerMOTD;
      } else {
        client.status = `Status do Servidor: Offline!`;
      }
    });

    client.user.setActivity(`${client.status} ${client.mcServerPlayersOnline}/${client.mcServerMaxPlayers} jogadores online.`, {
      type: 0
    }).catch(err => console.error('[TROCA DE STATUS] ', err));
  }, 5000);
};

start();