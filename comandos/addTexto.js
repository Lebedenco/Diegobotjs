const Discord = require('discord.js');

const utils = require('../utils/utils');
const canvas = require('../utils/canvas');

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.addTexto')
      .setDescription('Adiciona um texto à uma dada imagem.')
      .addField('**Aliases**', '``at``\n``addText``\n``addT``', true)
      .addField('**Argumentos**', '``imagem (string)``\n``texto (string)``\n``cor (string)``', true)
      .setFooter('.help')
    );
  }
  
  if (args.find(arg => arg.name === 'link')) {
    let image = args.find(arg => arg.name === 'link').value;

    if (args.find(arg => arg.name === 'txtArg1')) {
      const text = args.find(arg => arg.name === 'txtArg1').value;

      image = await canvas.addText(image, text, args.find(arg => arg.name === 'color') ? args.find(arg => arg.name === 'color').value : undefined);
    } else {
      return msg.channel.send(utils.showError('missing arguments'));
    }

    const attachment = new Discord.MessageAttachment(image, 'img.png');

    return msg.channel.send(new Discord.MessageEmbed()
      .attachFiles(attachment)
      .setImage('attachment://img.png')
    );
  }

  return msg.channel.send(showError('missing arguments'));
};

exports.help = {
  name: 'addTexto',
  aliases: [
    'addText',
    'addT',
    'at'
  ],
  description: 'Adiciona um texto à uma dada imagem.',
  args: [{
    name: 'imagem',
    expects: 'string',
    alias: ''
  }, {
    name: 'texto',
    expects: 'string',
    alias: ''
  }, {
    name: 'cor',
    expects: 'string',
    alias: ''
  }]
}