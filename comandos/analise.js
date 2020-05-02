const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
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

  let user, img;

  if (args.length > 0) {
    user = args.find(arg => arg.name.startsWith('message1')).value;
  }

  if (msg.attachments) {
    for await (value of msg.attachments.values()) {
      value.url ? img = value.url : '';
    }
  }
  else if (user) {
    user = client.users.cache.get(utils.formatUserID(user));
    img = avatar.run(client, msg, [{
      name: 'message1',
      value: user
    }, {
      name: 'format',
      value: 'png'
    }], true);
  } else {
    user = msg.author;
    img = avatar.run(client, msg, [{
      name: 'message1',
      value: user
    }, {
      name: 'format',
      value: 'png'
    }], true);
  }

  const image = await canvas.analise(img, path.join(__dirname, '../media/analise.png'));

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