const { createAudioPlayer, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');

const player = createAudioPlayer();

const queue = [];

function getNextSong() {
	return queue.pop();
}

function addToQueue(song) {
	queue.unshift(song);
	if (player.state.status === AudioPlayerStatus.Idle) {
		player.play(getNextSong());
	}
}

player.on(AudioPlayerStatus.Idle, () => {
	const song = getNextSong();
	if (!song) {
		const connection = getVoiceConnection('1155962358645129216');
		if (connection) {
			connection.disconnect();
		}
	}
	else {
		player.play(song);
	}
});
module.exports = {
	player,
	addToQueue,
};