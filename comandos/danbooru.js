const Discord = require('discord.js');
const Danbooru = require('danbooru');

const utils = require('../utils/utils');

const booru = new Danbooru();

exports.run = async (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.danbooru')
      .setDescription('Retorna uma imagem do Danbooru com a tag fornecida.')
      .addField('**Aliases**', '``dan``', true)
      .addField('**Argumentos**', '``tag (string)``\n``nsfw (boolean)``', true)
      .addField('**Como usar**', '``danbooru [tag] [--nsfw=true/false]``')
      .setFooter('.help')
    );
  }

  const rating = args.find(a => a.name === 'nsfw' && a.value === 'true') ? 'explicit' : 'safe';

  if (!args.find(arg => arg.name === 'message1')) {
    return msg.channel.send(utils.showError('missing arguments'));
  }

  const posts = await booru.posts({
      tags: `${args.find(a => a.name === 'message1').value} rating:${rating}`
    })
    .then(posts => {
      const index = Math.floor(Math.random() * posts.length)
      const post = posts[index]

      if (post && rating === 'explicit' && msg.channel.nsfw) {
        return msg.channel.send(post.large_file_url);
      } else if (post && rating === 'explicit') {
        return msg.channel.send(utils.showError('now nsfw'));
      } else if (post) {
        return msg.channel.send(post.large_file_url);
      }

      return msg.channel.send(utils.showError(404));
    })
    .catch(err => {
      return msg.channel.send(utils.showError(err))
    });
};

exports.help = {
  name: 'danbooru',
  aliases: [
    'dan'
  ],
  description: 'Retorna uma imagem do Danbooru com a tag fornecida.',
  args: [{
    name: 'tag',
    expects: 'string',
    alias: ''
  }, {
    name: 'nsfw',
    expects: 'boolean',
    alias: ''
  }],
  usage: 'danbooru [tag] [--nsfw=true/false]'
}