const { SlashCommandBuilder } = require('discord.js');
// const { joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
// const { getVoiceConnection, createAudioPlayer, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
// const ytdl = require('ytdl-core');
// const { join } = require('node:path');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt')
		.setDescription('Plays yt.')
		.addStringOption(option =>
			option
				.setName('url')
				.setDescription('Video url')),

	async execute(interaction) {
		const url = interaction.options.getString('url');

		await interaction.reply('La url es: ' + url);


		// const guild = interaction.client.guilds.cache.get('1155962358645129216');
		// const member = guild.members.cache.get(interaction.member.user.id);
		// const voiceChannel = member.voice.channel;


		// const player = createAudioPlayer();


		// const connection = joinVoiceChannel({
		// 	channelId: voiceChannel.id,
		// 	guildId: guild.id,
		// 	adapterCreator: guild.voiceAdapterCreator,
		// 	selfDeaf: false,
		// 	debug: true,
		// 	selfMute: false,
		// });
		// const resource = createAudioResource(join(__dirname, 'audio.mp3'), { inlineVolume   : true });

		// console.log(join(__dirname, 'audio.mp3'));
		// resource.volume.setVolume(0.5);

		// player.play(resource);
		// connection.subscribe(player);

		// player.on(AudioPlayerStatus.Playing, () => {
		// 	console.log('The audio player has started playing!');
		// });

		// player.on(AudioPlayerStatus.Idle, () => {
		// 	console.log('The audio player has stopped!');
		// });


	},
};