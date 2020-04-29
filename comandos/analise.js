const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' && arg.value === 'true') || arg.name === 'h')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.avatar')
      .setDescription('Ao fornecer um usuário, retorna uma montagem de seu avatar fazendo análise.')
      .addField('**Aliases**', 'Não possui aliases.', true)
      .addField('**Argumentos**', '``user (string)``', true)
      .setFooter('.help')
    );
  }
  
  const canvas = require('../utils/canvas');
  const avatar = require('./avatar');
  const path = require('path');

  let user;

  if (args.length > 0) {
    user = args.find(arg => arg.name.startsWith('txtArg1')).value;
  }

  if (user) {
    user = client.users.cache.get(utils.formatUserID(user));
  } else {
    user = msg.author;
  }

  const image = await canvas.analise(avatar.run(client, msg, [{
      name: 'txtArg1',
      value: user
    }, {
      name: 'format',
      value: 'png'
    }], true), path.join(__dirname, '../media/analise.png'));

  const attachment = new Discord.MessageAttachment(image, 'image.png');

  return msg.channel.send(new Discord.MessageEmbed()
    .setTitle('Análise')
    .attachFiles(attachment)
    .setImage('attachment://image.png')
  );
};

exports.help = {
  name: 'analise',
  aliases: [],
  description: 'Ao fornecer um usuário, retorna uma montagem de seu avatar fazendo análise.',
  args: [{
    'name': 'user',
    'expects': 'string',
    'alias': ''
  }]
}