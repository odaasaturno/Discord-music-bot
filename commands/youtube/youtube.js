const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { player, addToQueue } = require('../../logic/player');

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
		await interaction.deferReply({ ephemeral: true });

		// if it's not a valid URL, stop.
		if (!ytdl.validateURL(url)) {
			await interaction.editReply({ content: 'Por favor, elige una URL de yt valida૮ ´• ﻌ ´• ა', ephemeral: true });
			return;
		}

		// If the video does not exist, stop.
		let videoInfo;
		try {
			videoInfo = await ytdl.getInfo(url);
		}
		catch (err) {
			console.error(err);
			await interaction.editReply({ content: 'No pudimos descargar tu video ᐡ ᐧ ﻌ ᐧ ᐡ', ephemeral: true });
			return;
		}


		// get stream from info
		const stream = ytdl.downloadFromInfo(videoInfo, {
			filter: 'audioonly',
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
		});


		// create discord audio resource
		const song = createAudioResource(stream, { inlineVolume: true });

		const guild = interaction.client.guilds.cache.get(interaction.guildId);
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			interaction.editReply({ content: 'Por favor, unite a un canal de voz para ejecutar este comandoᐡ ᐧ ﻌ ᐧ ᐡ ', ephemeral: true });
			return;
		}

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

		song.volume.setVolume(0.3);
		await interaction.editReply({ content: url + ' agregado a la cola!', ephemeral: true });
		await addToQueue({ resource: song, title: videoInfo.videoDetails.title });


		connection.subscribe(player);


	},
};