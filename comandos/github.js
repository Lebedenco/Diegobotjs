const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.github')
      .setDescription('Retorna o código fonte deste bot.')
      .addField('**Aliases**', '``git``\n``gh``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .setFooter('.help')
    );
  }

  return msg.channel.send('https://github.com/Lebedenco/Diegobotjs');
};

exports.help = {
  name: 'github',
  aliases: [
    'git',
    'gh'
  ],
  description: 'Retorna o código fonte deste bot.',
  args: []
};