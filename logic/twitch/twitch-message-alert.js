const { emitter, start } = require('./twitch');
const bot = require('../bot');
const { EmbedBuilder } = require('discord.js');

function registerListener() {
    start();
    emitter.on('streamOnline', function (e) {
        sendMessage(e)
    });
}

async function sendMessage(e) {
    const exampleEmbed = new EmbedBuilder()
        .setColor(0xFCAAFF)
        .setTitle(e.title)
        .setURL(e.url)
        .setAuthor({ name: e.name + ' está en directo 🔴' , iconURL: 'https://cdn.discordapp.com/app-icons/1159251719188922478/204ec78d018280dc676d0e7bfe3841cc.png?size=512', url: e.url })
        .setImage('https://i.pinimg.com/564x/aa/f2/2b/aaf22b723cb6f8184724af19637b00cf.jpg')
        .setFooter({ text: 'Pasate a saludar <3' })

	const channel = await bot.channels.fetch('1162520588196261988');
    await channel.send({ embeds: [exampleEmbed] });
}

module.exports = {
    registerListener
}
