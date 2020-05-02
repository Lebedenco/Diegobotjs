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
    let numStrArgs = 1;
    let numNumArgs = 1;
    let numLinkArgs = 1;

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
              name: isNaN(parseInt(newString.split(' ')[1], 10)) ? `string${numStrArgs++}` : `number${numNumArgs++}`,
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
            name: isNaN(parseInt(newString, 10)) ? `string${numStrArgs++}` : `number${numNumArgs++}`,
            value: newString
          })
        } else if (newString.startsWith('https://')) {
          args.push({
            name: `link${numLinkArgs}`,
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
      if ((typeof (arg.value) === 'string' || typeof (arg.value) === 'number') && !arg.name.startsWith('string') && arg.value.split(' ')[1]) {
        let message = arg.value.split(' ');

        arg.value = message[0];
        message = message.splice(1).toString().replace(/,/g, ' ');

        args2.push({
          name: `string${numStrArgs++}`,
          value: message
        })
      } else if (!arg.name.startsWith('string') && arg.name.split(' ')[1]) {
        let message = arg.name.split(' ');
        arg.name = message[0];
        message = message.splice(1).toString().replace(/,/g, ' ');

        args2.push({
          name: `string${numStrArgs++}`,
          value: message
        })
      } else if (arg.name.startsWith('string') && arg.value.split(' ')[1]) {
        let message = arg.value.split(' ');

        message.forEach(m => {
          if (m.startsWith('https://')) {
            args2.push({
              name: `link${numLinkArgs++}`,
              value: m
            })

            arg.name = `string${numStrArgs > 1 ? --numStrArgs : numStrArgs}`;
            arg.value = arg.value.split(' https')[0];
          }
        });
      }
    });

    for (let i = 0; i < args2.length; i++) {
      if (args2[i].value.split(' ')[1] && args2[i].value.startsWith('https://')) {
        let message = args2[i].value.split(' ');

        args2[i].value = message[0];
        args2[i].name = `link${numLinkArgs++}`;

        message = message.splice(1).toString().replace(/,/g, ' ');

        args2.push({
          name: `string${numStrArgs > 1 ? --numStrArgs : numStrArgs}`,
          value: message
        });
      } else if (!args2[i].name.startsWith('link') && args2[i].value.split('https')[1]) {
        let message = args2[i].value.split(' ');
        let j = 0;

        args2[i].value = '';

        for (let m = 0; m < message.length; m++) {
          j++;

          if (message[m].startsWith('https')) {
            break;
          }

          args2[i].value += message.shift() + ' ';
          m--;
        }
        args2[i].name = `string${numStrArgs++}`;
        args2[i].value = args2[i].value.substring(0, args2[i].value.length - 1);

        message = message.toString().replace(/,/g, ' ');

        args2.push({
          name: `string${numStrArgs++}`,
          value: message
        });
      }

      args.push({
        name: args2[i].name,
        value: args2[i].value
      })
    }

    args.sort((arg, arg2) => {
      if (arg.name > arg2.name) {
        return 1;
      } else {
        return -1;
      }

      return 0;
    });

    return args;
  }
}