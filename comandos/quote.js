const Discord = require('discord.js');

const utils = require('../utils/utils');
const config = require('../config/config.json');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.quote')
      .setDescription('Retorna uma citação.')
      .addField('**Aliases**', '``citacao``\n``citação``', true)
      .addField('**Argumentos**', '``número (number)``\n``add | a (boolean)``\n``mensagem (string)``', true)
      .setFooter('.help')
    );
  }

  if (args.find(arg => (arg.name === 'add' || arg.name === 'a') && arg.value.toString() === 'true')) {
    const message = args.find(arg => arg.name === 'message1').value;

    console.log(message);
  }

  return msg.channel.send('WIP');
};

exports.help = {
  name: 'quote',
  aliases: [
    'citacao',
    'citação'
  ],
  description: 'Retorna uma citação.',
  args: [{
    name: 'número',
    expects: 'number',
    alias: ''
  }, {
    name: 'add',
    expects: 'boolean',
    alias: 'a'
  }, {
    name: 'mensagem',
    expects: 'string',
    alias: ''
  }]
}