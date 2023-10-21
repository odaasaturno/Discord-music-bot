const { AppTokenAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api')
const { DirectConnectionAdapter, EventSubHttpListener } = require('@twurple/eventsub-http');
const fs = require('fs');
const { EventEmitter } = require('events');

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const adapter = new DirectConnectionAdapter({
	hostName: process.env.TWITCH_HOSTNAME,
	sslCert: {
		key: fs.readFileSync(process.env.KEY_PATH),
		cert: fs.readFileSync(process.env.CERT_PATH)
	}
});
const secret = process.env.SECRET;

const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

const emitter = new EventEmitter();

function readConfig() {
    try {
        return  JSON.parse(fs.readFileSync('./twitchusers.json'));
    } catch (err) {
        console.error('Error reading twitchusers.json');
        console.error(err)
    }
}


async function getUserId(twitchUsername) {
    try {
        const user = await apiClient.users.getUserByName(twitchUsername);
        if (!user) return;
        return user.id;
    } catch(err) {
        console.error('User with username ' + twitchUsername + ' not found')
        console.error(err)
        return
    }
}

let listener;
async function start() {
    listener = new EventSubHttpListener({ apiClient, adapter, secret });

    const usersConfig = readConfig();

    usersConfig.users.forEach(async (userName) => {
        const userId = await getUserId(userName);
        if (!userId) return;

        console.info('Registering ' + userName + ' as ' + userId)

        listener.onStreamOnline(userId, async (e) => {
            const name = e.broadcasterDisplayName;
            const username = e.broadcasterName;

	    console.log(username + ' just went live');

            const url = 'https://twitch.tv/' + username;

            const stream = await e.getStream();
	    const { title } = stream;

            const data = {
                url,
                name,
                title
            }

            emitter.emit('streamOnline', data)
        });
    })
    
    listener.start();
}

async function reload() {
    listener.stop();
    listener = new EventSubHttpListener({ apiClient, adapter, secret });
    await start();
}

module.exports = {
    emitter,
    start,
    reload
}
