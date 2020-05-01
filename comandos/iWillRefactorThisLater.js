const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.iWillRefactorThisLater')
      .setDescription('Retorna a música I Will Refactor This Later.')
      .addField('**Aliases**', '``iwrtl``\n``refactor``', true)
      .addField('**Argumentos**', 'Não possui argumentos.', true)
      .setFooter('.help')
    );
  }

  return msg.channel.send('WIP');
};

exports.help = {
  name: 'iWillRefactorThisLater',
  aliases: [
    'iwrtl',
    'refactor'
  ],
  description: 'Retorna a música I Will Refactor This Later.',
  args: []
}