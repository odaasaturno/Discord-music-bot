const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../logic/player');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pausa')
		.setDescription('Pausa el bot'),
	async execute(interaction) {
		if (player.state.status === AudioPlayerStatus.Playing) {
			player.pause();
			interaction.reply('Pausado૮⍝• ᴥ •⍝ა');
		}
		else {
			interaction.reply('Uy, no hay nada reporduciendose૮・ᵔ・ა');
		}
	},
};
