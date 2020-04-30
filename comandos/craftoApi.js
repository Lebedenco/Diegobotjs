const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.craftoapi')
      .setDescription('Retorna o código fonte da CraftoAPI, utilizada no comando crafting.')
      .addField('**Aliases**', '``api``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .setFooter('.help')
    );
  }
  
  return msg.channel.send('https://github.com/Lebedenco/Craftoapi');
};

exports.help = {
  name: 'craftoapi',
  aliases: [
    'api'
  ],
  description: 'Retorna o código fonte da CraftoAPI, utilizada no comando crafting.',
  args: []
};