const { SlashCommandBuilder } = require('discord.js');
const { reload } = require('../../logic/twitch/twitch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitchreload')
		.setDescription('Recarga la config de twitch'),

	async execute(interaction) {
		const user = interaction.member.user.id;
		if (user !== '536347484990078976') {
			return interaction.reply('No tenes permiso.')
		}

		await interaction.deferReply({ ephemeral: true });

		await reload();

		interaction.editReply({ content: 'twitch recargado!', ephemeral: true });
	},
};
