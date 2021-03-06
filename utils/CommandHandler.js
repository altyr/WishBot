let utils = require('./../utils/utils.js')

module.exports = function(bot, msg, suffix, cmdTxt) {
    if ((commands[cmdTxt].type === "mod" || commands[cmdTxt].type === "mod") && !((msg.channel.permissionsOf(msg.author.id).has('manageGuild')) || admins.indexOf(msg.author.id) > -1)) return;
    else if (commands[cmdTxt].type === "admin" && admins.indexOf(msg.author.id) === -1) return;
    else {
        processCmd(bot, msg, suffix, cmdTxt);
        UsageChecker.updateTimestamp(msg.channel.guild);
    }
}

function processCmd(bot, msg, suffix, cmdTxt) {
    let cmd = commands[cmdTxt];
    if (cmd.privateCheck(msg)) return;
    else if (!(admins.indexOf(msg.author.id) > -1) && cmd.cooldownCheck(msg.author.id)) bot.createMessage(msg.channel.id, `${utils.toTitleCase(cmdTxt)} is currently on cooldown for ${cmd.cooldownTime(msg.author.id).toFixed(1)}s`);
    else {
        try {
            if (cmd.delete) bot.deleteMessage(msg.channel.id, msg.id).catch();
            cmd.process(bot, msg, suffix);
            console.log(serverC("@" + msg.channel.guild.name + ":") + channelC(" #" + msg.channel.name) + ": " + warningC(cmdTxt) + " was used by " + userC(msg.author.username));
        } catch (err) {
            bot.createMessage(msg.channel.id, "```" + err + "```").catch();
            console.log(errorC(err.stack));
        }
    }
}