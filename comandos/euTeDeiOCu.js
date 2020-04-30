const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.euTeDeiOCu')
      .setDescription('É isso.')
      .addField('**Aliases**', '``etdoc``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .setFooter('.help')
    );
  }

  return msg.channel.send('https://youtu.be/vt92Upzj_V0?t=68');
};

exports.help = {
  name: 'euTeDeiOCu',
  aliases: [
    'etdoc'
  ],
  description: 'É isso.',
  args: []
}