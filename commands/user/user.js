const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Provides information about the user.')
				.setRequired(true),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('target');

		interaction.reply('El nombre del usuario es ' + user.username);
	},
};