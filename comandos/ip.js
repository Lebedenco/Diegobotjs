const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.ip')
      .setDescription('Retorna o IP do Servidor de Minecraft com Mods.')
      .addField('**Aliases**', 'Não possui aliases.', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .addField('**Como usar**', '``ip``')
      .setFooter('.help')
      );
  }
  
  if (msg.member.roles.cache.find(r => r.name === 'Minecraft')) {
    return msg.author.send(`IP do servidor de Minecraft com Mods! ${process.env.IP}`);
  }
  return msg.channel.send(utils.showError('not permission'));
};

exports.help = {
  name: 'ip',
  aliases: [],
  description: 'Retorna o IP do Servidor de Minecraft com Mods.',
  args: [],
  usage: 'ip'
};