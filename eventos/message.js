const Discord = require('discord.js');
const dotenv = require('dotenv').config();

const utils = require('../utils/utils');

const prefix = process.env.PREFIX;
const botID = process.env.DIEGOBOTID

const message = async (client, msg) => {
  if (msg.author.id === botID) {
    return;
  }

  if (msg.content.includes('@everyone')) {
    msg.channel.send('https://www.youtube.com/watch?v=t5l_7GsgXxs');
  }

  if (msg.channel instanceof Discord.DMChannel) {
    const diego = client.users.cache.get(diegoId);

    diego.send(`${msg.author}: ${msg.content}`);
  }

  if (!msg.content.startsWith(prefix)) {
    return;
  }

  const args = utils.getArgs(msg.content.slice(msg.content.split(' ')[0].length + 1));
  const cmd = msg.content.split(' ')[0];

  const command = getCommand(client, cmd);

  if (command) {
    console.log(`[COMANDO.RUN] ${command.help.name} Argumentos: ${args.length > 0 ? args.map(arg => arg.name + ' = ' + arg.value) : ' '}`);
    command.run(client, msg, args)
  }
};

const getCommand = (client, commandName) => {
  commandName = commandName.slice(`${prefix}`.length);

  let command = client.commands.get(commandName);

  if (!command) {
    command = client.commands.get(client.aliases.get(commandName));
  }

  return command
}

module.exports = {
  name: 'message',
  run: message
}