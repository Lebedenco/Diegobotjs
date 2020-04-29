const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  console.log(args);
  
  if (args.find(arg => (arg.name === 'help' && arg.value === 'true') || arg.name === 'h')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.programmingHumor')
      .setDescription('Retorna um (ou mais, fornecendo um argumento) meme do subreddit /r/ProgrammingHumor.')
      .addField('**Aliases**', '``ph``\n``pHumor``\n``programmingH``\n``programmingMeme``', true)
      .addField('**Argumentos**', '``number | n (number)``\n``limit | l (number)``\n``after | a (number)``', true)
      .setFooter('.help')
    );
  }
  
  const feed = require('../feed');

  let numItems = 1;
  let after = 0;
  let limit = 100;

  args.forEach(a => {
    if (a.name === 'number' || a.name === 'n') {
      numItems = a.value;
    } else if (a.name === 'limit' || a.name === 'l') {
      limit = a.value;
    } else if (a.name === 'after' || a.name === 'a') {
      after = a.value;
    }
  })

  console.log(numItems, limit, after)

  if (numItems > 10) {
    return msg.channel.send(utils.showError('Pera lá, amigão! Muitos memes, escolha um número menor!'));;
  }

  feed.parse(`https://www.reddit.com/r/ProgrammerHumor.rss?limit=${limit}?after=${after}`, (err, items) => {
    if (!err) {
      for (let i = 0; i < numItems; i++) {
        const item = items[utils.getRandomInt(0, items.length)];
        const image = item.description.split('<span>')[1].split('</span>')[0].replace('<a href="', '').replace('">[link]</a>', '');

        msg.channel.send(new Discord.MessageEmbed()
          .setTitle(item.title)
          .setImage(image)
          .setAuthor(item.author)
          .setThumbnail(msg.author.avatarURL(msg.author.avatar))
        );
      }
    } else {
      msg.channel.send(utils.showError(err.message));
    }
  });
};

exports.help = {
  name: 'programmingHumor',
  aliases: [
    'ph',
    'pHumor',
    'programmingH',
    'programmingMeme'
  ],
  description: 'Retorna um (ou mais, fornecendo um argumento) meme do subreddit /r/ProgrammingHumor.',
  args: [{
    name: 'number',
    expects: 'number',
    alias: 'n'
  }, {
    name: 'limit',
    expects: 'number',
    alias: 'l'
  }, {
    name: 'after',
    expects: 'number',
    alias: 'a'
  }]
}