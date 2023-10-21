const { RefreshingAuthProvider, StaticAuthProvider } = require('@twurple/auth')
const { ApiClient } = require('@twurple/api')
const { EventSubWsListener } = require('@twurple/eventsub-ws');
const fs = require('fs');
const { EventEmitter } = require('events');

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

let authProvider 

let apiClient;

async function twitchAuth() {
    const tokenData = JSON.parse(fs.readFileSync('./tokens.494160311.json'));
    authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret
        }
    );

    authProvider.onRefresh(async (userId, newTokenData) => fs.writeFileSync(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4)));

    const userId = await authProvider.addUserForToken(tokenData);
    return authProvider.getAnyAccessToken(userId)
}

async function getAccess() {
    return twitchAuth()
}

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
    const { accessToken } = await getAccess();

    const authProvider = new StaticAuthProvider(clientId, accessToken);
    apiClient = new ApiClient({ authProvider });

    listener = new EventSubWsListener({ apiClient });

    const usersConfig = readConfig();

    usersConfig.users.forEach(async (userName) => {
        const userId = await getUserId(userName);
        if (!userId) return;

        console.info('Registering ' + userName + ' as ' + userId)

        listener.onStreamOnline(userId, async (e) => {
            const name = e.broadcasterDisplayName;
            const username = e.broadcasterName;

            const url = 'https://twitch.tv/' + username;

            const { title } = await e.getStream()

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
    listener = new EventSubWsListener({ apiClient });
    await start();
}

module.exports = {
    emitter,
    start,
    reload
}
