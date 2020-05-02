const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.iWillRefactorThisLater')
      .setDescription('Retorna a música I Will Refactor This Later.')
      .addField('**Aliases**', '``iwrtl``\n``refactor``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .addField('**Como usar**', '``iWillRefactorThisLater [--full]``')
      .setFooter('.help')
    );
  }

  if (args.find(arg => (arg.name === 'full' || arg.name === 'f') && arg.value.toString() === 'true')) {
    return msg.channel.send('https://www.youtube.com/watch?v=SETnK2ny1R0');
  }

  return msg.channel.send('https://soundcloud.com/espen-sande-larsen-365984601/refactor');
};

exports.help = {
  name: 'iWillRefactorThisLater',
  aliases: [
    'iwrtl',
    'refactor'
  ],
  description: 'Retorna a música I Will Refactor This Later.',
  args: [{
    name: 'full',
    expects: 'boolean',
    alias: 'f'
  }],
  usage: 'iWillRefactorThisLater [--full]'
}