import Discord from 'discord.js';
import { openaiClient } from '../openaiClient/index.js';
export const createDiscordBot = ()=>{
    const discordClient = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds, 
        Discord.GatewayIntentBits.GuildMessages, 
        Discord.GatewayIntentBits.MessageContent
    ]
    });

    discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
    //console.log(discordClient.channels);
    });

    discordClient.on("messageCreate", async (message) => {
    if (message.mentions.has(discordClient.user.id)) {
        // const channel = discordClient.channels.cache.get(message.channelId);
        const actualMessage = message.content.replace(`<@${discordClient.user.id}>`, '').trim();
        try{
        const completion = await openaiClient.createCompletion({
            model: "text-davinci-003",
            prompt: actualMessage,
            temperature: 0.5,
            max_tokens: 256
        });
        return message.reply(completion.data.choices[0].text);
        } catch(err) {
        if (err.response) {
            console.log(err.response.status);
            console.log(err.response.data);
        } else {
            console.log(err.message);
        }
        return message.reply('Oops! API has returned error');
        }
    }
    });

    discordClient.login(process.env.DISCORD_BOT_TOKEN);
}