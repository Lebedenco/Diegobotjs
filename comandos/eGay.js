const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  // sendHelp
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.eGay')
      .setDescription('Verifica se um dado usuário é gay ou não.')
      .addField('**Aliases**', '``eg``', true)
      .addField('**Argumentos**', '``user (number)``', true)
      .addField('**Como usar**', '``eGay [idDoUsuário]``')
      .setFooter('.help')
    );
  }

  let user = msg.content.split(' ')[1];

  if (user) {
    user = client.users.cache.get(utils.formatUserID(user));

    const randInt = utils.getRandomInt(0, 100);

    if (randInt % 2 === 0) {
      return msg.channel.send('É.');
    } else if (randInt === 24) {
      return msg.channel.send('É MUITO gay.');
    }

    return msg.channel.send('Não é.');
  }
  return msg.channel.send(utils.showError(400));
};

exports.help = {
  name: 'eGay',
  aliases: [
    'eg'
  ],
  description: 'Verifica se um dado usuário é gay ou não.',
  args: [{
    name: 'user',
    expects: 'number',
    alias: ''
  }],
  usage: 'eGay [idDoUsuário]'
};