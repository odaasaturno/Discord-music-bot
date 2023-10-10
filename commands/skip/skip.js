const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../logic/player');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skipea a la siguiente cancion en la cola'),
	async execute(interaction) {
		if (player.state.status === AudioPlayerStatus.Playing) {
			player.stop();
			interaction.reply('Skipeando');
		}
		else {
			interaction.reply('No hay nada para skipear');
		}
	},
};
