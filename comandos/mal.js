const Jikan = require('jikan-node');
const Discord = require('discord.js');

const utils = require('../utils/utils');

exports.run = (client, msg, args) => {
  if (args.find(arg => (arg.name === 'help' || arg.name === 'h') && arg.value.toString() === 'true')) {
    return msg.channel.send(new Discord.MessageEmbed()
      .setTitle('.mal')
      .setDescription('Retorna informações do My Anime List.')
      .addField('**Aliases**', 'Não possui aliases.', true)
      .addField('**Argumentos: **', '``value (string)``\n``user | u (boolean)``\n``character | ch (boolean)``\n``anime | a (boolean)``\n``club | cl (boolean)``\n' +
      '``genre | g (boolean)``\n``magazine | m (boolean)``\n``person | pe (boolean)``\n``producer | pr (boolean)``\n``schedule | sc (boolean)``\n' +
      '``season | se (boolean)``\n``top | t (boolean)``')
      .setFooter('.help')
    );
  }
  
  const mal = new Jikan();
  
  const argumentos = utils.getArgs(msg.content.slice(msg.content.split(' ')[0].length + 1));

  let value, arg;

  if (argumentos) {
    argumentos.forEach(a => {
      if (a.name.startsWith('txtArg1')) {
        value = a.value;
      } else if (a.value) {
        arg = a.name;
        value = a.value;
      } else {
        arg = a.name;
      }
    })
  }

  if ((arg === 'u' || !arg || arg === 'user') && arg.value === 'true') {
    mal.findUser(value)
      .then((res) => {
        const embed = new Discord.MessageEmbed()
          .setTitle(`MyAnimeList de ${value}`)
          .setColor(0xffc0cb)
          .setDescription(`Last online: ${res.last_online}`)
          .addField(`Days`, res.anime_stats.days_watched, true, true)
          .addField(`Watching`, res.anime_stats.watching, true, true)
          .addField(`Completed`, res.anime_stats.completed, true, true)
          .addField(`On hold`, res.anime_stats.on_hold, true, true)
          .addField(`Dropped`, res.anime_stats.dropped, true, true)
          .addField(`Plan to Watch`, res.anime_stats.plan_to_watch, true, true)
          .addField(`Episodes Watched`, res.anime_stats.episodes_watched, true, true)
          .setThumbnail(res.image_url);

        return msg.channel.send(embed);
      })
      .catch(err => {
        return msg.channel.send(utils.showError(err))
      });
  } else if ((arg === 'ch' || arg === 'character') && arg.value === 'true') {
    mal.findCharacter(value);
    console.log('Character');
  } else if ((arg === 'a' || arg === 'anime') && arg.value === 'true') {
    mal.findAnime(value);
    console.log('Anime');
  } else if ((arg === 'cl' || arg === 'club') && arg.value === 'true') {
    mal.findClub(value);
    console.log('Club');
  } else if ((arg === 'g' || arg === 'genre') && arg.value === 'true') {
    mal.findGenre(value);
    console.log('Genre');
  } else if ((arg === 'm' || arg === 'magazine') && arg.value === 'true') {
    mal.findMagazine(value);
    console.log('Magazine');
  } else if ((arg === 'pe' || arg === 'person') && arg.value === 'true') {
    mal.findPerson(value);
    console.log('Person');
  } else if ((arg === 'pr' || arg === 'producer') && arg.value === 'true') {
    mal.findProducer(value);
    console.log('Producer');
  } else if ((arg === 'sc' || arg === 'schedule') && arg.value === 'true') {
    mal.findSchedule(value);
    console.log('Schedule');
  } else if ((arg === 'se' || arg === 'season') && arg.value === 'true') {
    mal.findSeason(value);
    console.log('Season');
  } else if ((arg === 't' || arg === 'top') && arg.value === 'true') {
    mal.findTop(value);
    console.log('Top');
  }
};

exports.help = {
  name: 'mal',
  aliases: [],
  description: 'Retorna informações do My Anime List.',
  args: [{
    name: 'value',
    expects: 'string',
    alias: ''
  }, {
    name: 'user',
    expects: 'boolean',
    alias: 'u'
  }, {
    name: 'character',
    expects: 'boolean',
    alias: 'ch'
  }, {
    name: 'anime',
    expects: 'boolean',
    alias: 'a'
  }, {
    name: 'club',
    expects: 'boolean',
    alias: 'cl'
  }, {
    name: 'genre',
    expects: 'boolean',
    alias: 'g'
  }, {
    name: 'magazine',
    expects: 'boolean',
    alias: 'm'
  }, {
    name: 'person',
    expects: 'boolean',
    alias: 'pe'
  }, {
    name: 'producer',
    expects: 'boolean',
    alias: 'pr'
  }, {
    name: 'schedule',
    expects: 'boolean',
    alias: 'sc'
  }, {
    name: 'season',
    expects: 'boolean',
    alias: 'se'
  }, {
    name: 'top',
    expects: 'boolean',
    alias: 't'
  }]
};