const { createAudioPlayer, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const queueAnnounce = require('./queueannounce');


const player = createAudioPlayer();

/**
 * @type {{title: string, resource: Stream}[]}
 */
const queue = [];

function getNextSong() {
	return queue.pop();
}

/**
 * @param {{title: string, resource: Stream}} song
 */
async function addToQueue(song) {
	queue.unshift(song);
	await queueAnnounce(queue);

	if (player.state.status === AudioPlayerStatus.Idle) {
		player.play(getNextSong().resource);
	}
}


player.on(AudioPlayerStatus.Idle, () => {
	queueAnnounce(queue);

	const song = getNextSong();
	if (!song) {
		const connection = getVoiceConnection('1155962358645129216');
		if (connection) {
			connection.disconnect();
		}
	}
	else {
		player.play(song.resource);
	}
});
module.exports = {
	player,
	addToQueue,
	queue,
};
