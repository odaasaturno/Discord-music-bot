const bot = require('./bot');

let originalMessageId;
async function sendMessageOrUpdateIfExists(text) {
	const channel = await bot.channels.fetch('1156065924839907388');
	if (originalMessageId) {
		const originalMessage = await channel.messages.fetch(originalMessageId);
		originalMessage.edit(text);
	}
	else {
		const message = await channel.send(text);
		originalMessageId = message.id;
	}
}

async function queueAnnounce(queue) {
	if (!queue.length) {
		return;
	}

	let message = 'Cola:\n';
	queue.reverse().forEach((song, index) => {
		message += `${(index + 1)}. ${song.title}\n`;
	});


	await sendMessageOrUpdateIfExists(message);
}

module.exports = queueAnnounce;