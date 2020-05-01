const {
  MessageEmbed
} = require('discord.js');

module.exports = {
  showError: (error) => {
    let err = 'Error!';

    if (error === 'Response: 400' || error === 400) {
      err = 'Requisição inválida.';
    } else if (error === 'Response: 404' || error === 404) {
      err = 'Conteúdo não encontrado.';
    } else if (error === 'not nsfw') {
      err = 'Este comando só pode ser usado em um canal NSFW!';
    } else if (error === 'not permission') {
      err = 'Você não tem acesso à este comando!';
    } else {
      err = error;
    }

    const embed = new MessageEmbed()
      .setTitle(`Erro!`)
      .setDescription(err)
      .setColor(0xff0000);

    return embed;
  },

  sendMondayMeme: (client, memeChannelID) => {
    client.channels.fetch(memeChannelID)
      .then(channel => channel.send('https://www.youtube.com/watch?v=9R4MtYRk6bA'));
  },

  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
  },

  formatUserID: (id) => {
    return id.replace(/</g, '').replace(/!/g, '').replace(/@/g, '').replace(/>/g, '');
  },

  getArgs: (string) => {
    let args = [];
    let newString = '';
    let numTxtArgs = 1;

    for (let i = 0; i <= string.length; i++) {
      if ((string[i] === ' ' && string[i + 1] === '-') || i === string.length || (newString[0] === '-' && string[i] === ' ') || (newString.startsWith('https://') && string[i] === ' ')) {
        if (newString[0] === '-' && newString[1] === '-') {
          const name = newString.split('=')[0];
          const value = newString.split('=')[1];

          args.push({
            name: name.substring(2),
            value: value ? value : true
          })
        } else if (newString[0] == '-' && newString.split('=')[0].slice(1).length < 3) {
          const name = newString.split('=')[0];
          const value = newString.split('=')[1];

          if (newString.split(' ')[1]) {
            args.push({
              name: `txtArg${numTxtArgs++}`,
              value: newString.split(' ')[1]
            });

            args.push({
              name: newString.split(' ')[0],
              value: value ? value : true
            });

            continue;
          }

          args.push({
            name: name.substring(1),
            value: value ? value : true
          })
        } else if (newString[0] !== '-' && newString !== '' && !newString.startsWith('https://')) {
          args.push({
            name: `txtArg${numTxtArgs++}`,
            value: newString
          })
        } else if (newString.startsWith('https://')) {
          args.push({
            name: 'link',
            value: newString
          })
        }

        newString = '';

        continue;
      }

      newString += string[i];
    }

    const args2 = [];

    args.forEach(arg => {
      if ((typeof (arg.value) === 'string' || typeof (arg.value) === 'number') && !arg.name.startsWith('txtArg') && arg.value.split(' ')[1]) {
        let txtArg = arg.value.split(' ');

        arg.value = txtArg[0];
        txtArg = txtArg.splice(1).toString().replace(/,/g, ' ');

        args2.push({
          name: `txtArg${numTxtArgs++}`,
          value: txtArg
        })
      } else if (!arg.name.startsWith('txtArg') && arg.name.split(' ')[1]) {
        let txtArg = arg.name.split(' ');

        arg.name = txtArg[0];
        txtArg = txtArg.splice(1).toString().replace(/,/g, ' ');

        args2.push({
          name: `txtArg${numTxtArgs++}`,
          value: txtArg
        })
      }
    });

    args2.forEach(a => args.push({
      name: a.name,
      value: a.value
    }));

    return args;
  }
}