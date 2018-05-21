require("dotenv").config();

var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require (fs);

var keys = require('./keys.js');

var node = process.argv;

var  command = "";

for(var i=2; i<node.length;i++){
    if(i<command.length){
        command += "+" + node[i];
    }else{
        command += node[i];
    }
}

function socialApp(){
    var user = new twitter(keys.twitterKeys);

    var account = {screen_name: 'realDonaldTrump', count: 20};
    
    var output = "**********\n" + "Tweets:\n" + "**********\n\n";

    user.get('statuses/user_timeline', account, function(error, tweets, response){
        if(!error && response.statusCode === 200){
            for(var i=0; i < tweets.length; i++){
                output += "'" + tweets[i].text + "' " + "\n" + tweets[i].created_at + "\n" + "**********\n";
            }
        }
    })
}

function musicApp(song){
    var search;
    if(song === ""){
        search = "Here on Earth Tiesto";
    }else{
        search = song;
    }

    spotify.search({type: 'track', query: search}, function(error, data){
        if(!error){
            var info = data.tracks.items[0];
            var output = "**********\n" + "Song:\n" + "**********\n\n" + "Name: " + info.name + "\n" + "Artist: " + info.artists[0].name + "\n" + "Album: " + info.album.name + "\n" + "Preview: " + info.preview_url + "\n";
        }
    })
}

function movieApp(movie){
    var search;
    if(movie === ""){
        search = "Fight Club";
    }else{
        search = movie;
    }
    search = search.split(" ").join("+");

    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&plot=fullt&tomatoes=true&apikey=33b08ab7";

    request(queryUrl, function(error, response, body){
        var info = JSON.parse(body);
        var output = "**********\n" + "Movie:\n" + "**********\n\n" + "Title: " + info.Title + "\n" + "Release Date: " + info.Released + "\n" + "IMBD Rating: " + info.imbdRating + "\n" + "Country of Origin: " + info.Country + "\n" + "Language: " + info.Language + "\n" +  "Plot: " + info.Plot + "\n" + "Actors: " + info.Actors + "\n" + "Country of Rotten Tomatoes Rating: " + info.tomatoRating + "\n" + "Rotten Tomatoes URL: " + info.tomatoURL + "\n";

    })
}
