const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  // sendHelp
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.ouija')
      .setDescription('Retorna uma resposta estilo Ouija para uma pergunta.')
      .addField('**Aliases**', '``Não possui aliases``', true)
      .addField('**Argumentos**', '', true)
      .addField('**Como usar**', '````')
      .setFooter('.help')
    );
  }

  return msg.channel.send('WIP');
};

exports.help = {
  name: 'ouija',
  aliases: [],
  description: 'Retorna uma resposta estilo Ouija para uma pergunta.',
  args: [{
    name: 'pergunta',
    expects: 'message',
    alias: ''
  }],
  usage: ''
};