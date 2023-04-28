// gbbot Discord bot
// version: 2.0.1

const Discord = require('discord.js');
const auth = require('./auth.json');
const package = require('./package.json');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Connected as: ' + package.name);
});

client.on('message', message => {
    // listen for message starting with '!'
    if(message.content.substring(0,1) == '!'){
        var args = message.content.substring(1).split(' ');
        var cmd = args[0].toLowerCase();

        switch(cmd){
            // !help
            // displays list of commands
            case 'help':
                message.channel.send('Welcome to the gbbot Discord bot v2.0.1!\n\n!help: What you are reading now.\n!ping: Pings bot hosted at helf.io.\n!changelog: Posts changelog.\n!vote: '+
                'Adds yea and nay reactions to message starting with !vote.\n\nThis bot is still a work in progress. Please report bugs to ---.\nThank you for using the gbbot Discord bot!');
            break;
            
            // !-poke
            // used in tandem with IsThisWilliam bot to keep both bots awake. Waits 4 minutes then pokes the opposing bot to do the same.
            case '-poke':
                setTimeout(poke, 240000, message);
            break;

            // !ping
            // returns short message to test bot
            case 'ping':
                message.channel.send('Pong.');
            break;

            // !changelog
            // returns changelog
            case 'changelog':
                message.channel.send('v2.0.1: Fixed issue with emojis used in reactions for !vote. '+
                'Fixed version numbering to be in line with conventions.\nv2.0.0: Rewrote bot using discord.js package. Added commands !changelog and !vote. '+
                '\nv1.2.0: Added poke functionality.\nv1.1.0: Added reactions to certain keywords.\nv1.0.0: Bot created using discord.io package. Added commands !ping and !help.');
            break;

            // !vote
            // reacts with yea and nay emotes on a message starting with '!vote'
            case 'vote':
                message.react('687436122648739908');
                message.react('687436122468777984');
            break;

            // !schedule
            // creates an embed with a date and time and allows users to rsvp
            case 'schedule':
                message.delete();
                schedule(message);
            break;

        }
    }

    if(message.author.id !== client.user.id){
        // posts well copypasta in response to the word 'well'
//      if(message.content.toLowerCase().search(/well/) != -1){
//          message.channel.send('Well, well, well. Would you look at this well. Except you can\'t because there is no well. Because it wasn\'t maintained very well at all. If you are well enough '+
//          'equipped, could you perhaps build me a new well? Then i can perhaps, well, stop saying well so much for a start.');
//      }

        // posts william image in response to the word 'william'
        if(message.content.toLowerCase().search(/william/) != -1){
            message.channel.send('https://imgur.com/DcF9Kl8.jpg');
        }

        // posts sadroll emote in response to the word 'sad'
        if(message.content.toLowerCase().search(/sad/) != -1){
            message.channel.send('<a:sadroll:700165608674951241>');
        }

        // posts moon2L emote in response to the word 'hot'
        if(message.content.toLowerCase().search(/hot/) != -1){
            message.channel.send('<:moon2L:695041816759631953>');
        }

        // posts leaPing emote in response to being pinged
        if(message.content.toLowerCase().search(/@everyone/) != -1){
            message.channel.send('<:leaPing:709095604302905424>');
        }

    }
});

// helper method for the poke functionality
function poke(message){
    message.channel.send('?-poke');
}

//helper function for building and managing a scheduling embed
function schedule(message){
    var meetName, meetDesc, meetPlace, meetTime;
    var temp;
    var embMessage, curEmbed;
    message.channel.send('Please enter a name for this meeting.')
    .then((msg) => {temp = msg});
    message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 90000})
    .then(collected => {
        meetName = collected.first().content;
        collected.first().delete()
        .then(temp.delete())
        .then(message.channel.send('Please enter a description for this meeting.')
            .then((msg) => {temp = msg}))
        .catch(error => {message.channel.send('error msgdel1')});
        return message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 90000})
    })
    .then(collected => {
        meetDesc = collected.first().content;
        collected.first().delete()
        .then(temp.delete())
        .then(message.channel.send('Please enter a place for this meeting.')
            .then((msg) => {temp = msg}))
        .catch(error => {message.channel.send('error msgdel2')});
        return message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 90000})
    })
    .then(collected => {
        meetPlace = collected.first().content;
        collected.first().delete()
        .then(temp.delete())
        .then(message.channel.send('Please enter a date and/or time for this meeting.')
            .then((msg) => {temp = msg}))
        .catch(error => {message.channel.send('error msgdel3')});
        return message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 90000})
    })
    .then(collected => {
        meetTime = collected.first().content;
        collected.first().delete()
        .then(temp.delete())
        .catch(error => {message.channel.send('error msgdel4')});

        const meetEmbed = new Discord.MessageEmbed()
            .setColor('#924BD1')
            .setTitle(meetName)
            .setDescription(meetDesc)
            .addFields(
                { name: 'Place', value: meetPlace },
                { name: 'Date/Time', value: meetTime },
                { name: 'Going', value: '\u200B', inline: true },
                { name: 'Bad Timing', value: '\u200B', inline: true },
            )
            .setFooter('Scheduled by '+message.author.username, message.author.avatarURL());

        message.channel.send(meetEmbed)
        .then((msg) => {embMessage = msg, curEmbed = embMessage.embeds[0]});

        const filterYea = (reaction, user) => reaction.emoji.name === '687436122648739908' && user.id !== client.user.id;

//        const filterNay = (reaction) => {
//            return reaction.emoji.name === '687436122468777984' && user.id !== client.user.id;
//        };
//        const filterMin = (reaction) => {
//            return reaction.emoji.name === '687436184217321491' && user.id !== client.user.id;
//        };
        
        const collectorYea = embMessage.createReactionCollector(filterYea);
//        const collectorNay = embMessage.createReactionCollector(filterNay);
//        const collectorMin = embMessage.createReactionCollector(filterMin);

/*        message.react('687436122648739908')
        .then(message.react('687436122468777984'))
        .then(message.react('687436184217321491'))
        .catch(error => {message.channel.send('error msgrea')});
*/
/*        collectorYea.on('collect', (reaction, user) => {
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#924BD1')
                .setTitle(meetName)
                .setDescription(meetDesc)
                .addFields(
                    { name: 'Place', value: meetPlace },
                    { name: 'Date/Time', value: meetTime },
                    { name: 'Going', value: curEmbed.fields[3].value+', '+user.username, inline: true },
                    { name: 'Bad Timing', value: curEmbed.fields[4].value, inline: true },
                )
                .setFooter('Scheduled by '+message.author.username, message.author.avatarURL());

        });
*/






    })
    .catch(error => {message.channel.send('Request timed out after 90 seconds. Type faster next time.')});
    

    
}

client.login(auth.token);
