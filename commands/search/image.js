var request = require("request");
var options = require("./../../options/options.json");

module.exports = {
    usage: "Searches Imgur for an image with the mentioned terms and if no term is mentioned, Onee-chan is searched. If a subreddit is mentioned in the format `/r/[subreddit]` images from that subreddit will be returned. NSFW images will be ignored unless `--nsfw` is used\
    \n`image [term] or /r/[subreddit], <top> or <day> or <week> or <month> or <year> or <all>, <page #>`",
    delete: true,
    cooldown: 5,
    type: "searches",
    process: function(bot, msg, suffix) {
        var response = {};
        var query = "Onee-chan";
        var sort = "top";
        var page = 0;
        if (suffix.split(",")[0]) query = suffix.split(",")[0];
        if (suffix.split(",")[1]) {
            var temp = suffix.split(",")[1].replace(/ /g, "");
            if (temp === "top") sort = "top";
            else if (temp === "day") sort = "day";
            else if (temp === "week") sort = "week";
            else if (temp === "month") sort = "month";
            else if (temp === "year") sort = "year";
            else if (temp === "all") sort = "all";
        }
        if (query.startsWith("/r/")) {
            query = query.replace(" ", "_");
            var apiURL = "https://api.imgur.com/3/gallery" + query + "/" + sort + "/";
            get_image(bot, msg, apiURL, query);
        } else {

            if (suffix.split(",")[2]) {
                var temp = suffix.split(",")[2].replace(/ /g, "");
                if (/^\d+$/.test(temp)) page = temp;
            }
            var apiURL = "https://api.imgur.com/3/gallery/search/" + sort + "/" + page + "/?q=" + query;
            get_image(bot, msg, apiURL, query);
        }
    }
}

function get_image(bot, msg, apiURL, query) {
    request({
        url: apiURL,
        headers: {
            'Authorization': 'Client-ID ' + options.imgur_id
        }
    }, (error, result, body) => {
        if (error) {
            console.log(errorC(error));
            bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai there was an error: ```" + error + "```");
        } else if (result.statusCode != 200) {
            bot.createMessage(msg.channel.id, "I'm sorry **" + msg.author.username + "**-senpai but I got the status code ```" + result.statusCode);
        } else if (body) {
            body = JSON.parse(body);
            if (body.hasOwnProperty("data") && body.data.length !== 0) {
                response = body.data[Math.floor(Math.random() * (body.data.length))];
                var postedDate = new Date(0);
                var temp = "";
                if (response.link != undefined) {
                    if (response.nsfw === true) {
                        bot.createMessage(msg.channel.id, "Your search for " + query + " was deemed to be too lewd, Senpai\nhttp://i.imgur.com/jKLnvR7.png");
                        return;
                    }
                    postedDate.setUTCSeconds(response.datetime)
                    if (response.description != null) {
                        temp = "\nDescription: " + response.description;
                        temp = temp.replace(/.*?:\/\//g, "");
                    }
                    bot.createMessage(msg.channel.id, "I searched Imgur for **\"" + query + "\"** and found this, **" + msg.author.username + "**-senpai:\n```ruby\nTitle: " + response.title + "" + temp + "\nDate Created: " + postedDate.toUTCString() + "```" + response.link);
                } else {
                    bot.createMessage(msg.channel.id, "I'm sorry but that search for \"**" + query + "**\" did not get any results, **" + msg.author.username + "**-senpai");
                }
            } else {
                bot.createMessage(msg.channel.id, "**" + msg.author.username + "**-senpai, I'm sorry but that search for \"**" + query + "**\" did not get any results.");
            }
        }
    });
}