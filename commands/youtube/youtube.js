const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { player } = require('../../logic/player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt')
		.setDescription('Reproduce videos de Youtube')
		.addStringOption(option =>
			option
				.setName('url')
				.setDescription('Url del video')),

	async execute(interaction) {
		const url = interaction.options.getString('url');

		// if it's not a valid URL, stop.
		if (!ytdl.validateURL(url)) {
			await interaction.reply('Por favor, elige una URL de yt valida૮ ´• ﻌ ´• ა');
			return;
		}

		// If the video does not exist, stop.
		let videoInfo;
		try {
			videoInfo = await ytdl.getInfo(url);
			await interaction.reply('Descargando: ' + videoInfo.videoDetails.title);
		}
		catch (err) {
			console.error(err);
			await interaction.reply('No pudimos descargar tu video ᐡ ᐧ ﻌ ᐧ ᐡ');
			return;
		}


		// get stream from info
		const stream = ytdl.downloadFromInfo(videoInfo, {
			filter: 'audioonly',
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
		});


		// create discord audio resource
		const resource = createAudioResource(stream, { inlineVolume: true });

		const guild = interaction.client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			interaction.followUp('Por favor, unite a un canal de voz para ejecutar este comandoᐡ ᐧ ﻌ ᐧ ᐡ ');
			return;
		}

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

		resource.volume.setVolume(0.3);


		connection.subscribe(player);

		connection.on(VoiceConnectionStatus.Ready, () => {
			console.log('The connection has entered the Ready state - ready to play audio!');
			player.play(resource);
			interaction.followUp('Reproduciendo ' + url);
		});

		player.on(AudioPlayerStatus.Buffering, () => {
			connection.disconnect();
		});


	},
};