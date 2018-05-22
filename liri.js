require("dotenv").config()

var keys = require('./keys.js');

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var fs = require ('fs');


var node = process.argv;

var command = node[2];

var stuffToDo = "";

for(var i=3; i<node.length;i++){
    if(i<command.length){
        stuffToDo += node[i] + " ";
    }
}

function socialApp(){
    fs.appendFile('./log.txt','Command: node liri.js my-tweets\n', function(error){
        if(error){
            throw error;
        }
    })

    var account = {screen_name: 'realDonaldTrump', count: 20};
    
    var output = "**********\n" + "Trump's Tweets:\n" + "**********\n\n";

    client.get('statuses/user_timeline', account, function(error, tweets, response){
        if(error){
            var errorText = "Twitter Error";
            fs.appendFile('./log.txt',errorText, function(error){
                if(error){
                    throw error;
                    console.log(errorText);
                }
            })
            return
        } else {

            var output = "**********\n" + "Trump's Tweets:\n" + "**********\n\n";

            for(var i=0; i < tweets.length; i++){
                output += "'" + tweets[i].text + "' " + "\n" + tweets[i].created_at + "\n" + "**********\n";
            }

            fs.appendFile("./log.txt", "LIRI:\n" + output + "\n", function(error){
                if(error){
                    throw error;
                }
                console.log(output);
            })
        }
    })
}

function musicApp(song){
    fs.appendFile("./log.txt", "Command: node liri.js spotify-this-song" + song + "\n", function(error){
        if(error){
            throw error;
        }
    })
    var search;
    if(song === ""){
        search = "Here on Earth Tiesto";
    }else{
        search = song;
    }



    spotify.search({type: 'track', query: search}, function(error, data){
        if(error){
            var errorText1 = "Spotify Error";

            fs.appendFile(".log/txt", errorText1, function(error){
                if(errror){
                    throw error
                    console.log(errorText1);
                }
            })
            return
        }else{
            var info = data.tracks.items[0];
            if(!info){
                var errorText2 = "Spotify Error 2";
                fs.appendFile("./log.txt", errorText2, function(error){
                    if(error){
                        throw error;
                        console.log(errorText2);
                    }
                })
                return;
            }else{
                var output = "**********\n" + "Song:\n" + "**********\n\n" + "Name: " + info.name + "\n" + "Artist: " + info.artists[0].name + "\n" + "Album: " + info.album.name + "\n" + "Preview: " + info.preview_url + "\n";
                fs.appendFile("./log.txt", "LIRI:\n" + output + "\n", function(error){
                if(error){
                    throw error;
                }
                console.log(output);
                })
            }
        }
    })
}

function movieApp(movie){
    fs.appendFile("./log.txt", "Command: node liri.js movie-this " + movie + "\n", function(error){
        if(error){
            throw error;
        }
    })
    var search;
    if(movie === ""){
        search = "Fight Club";
    }else{
        search = movie;
    }
    search = search.split(" ").join("+");

    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&plot=fullt&tomatoes=true&apikey=trilogy";

    request(queryUrl, function(error, response, body){
        if(error || response.statusCode !== 200){
            var errorText1 = "OMDB Error";
            fs.appendFile(".log/txt", errorText1, function(error){
                if(error){
                    throw error
                    console.log(errorText1);
                }
            }) 
            return;
        }else{
            var info = JSON.parse(body);
            if(info.title && !info.Released && !info.imdbRating){
                var errorText2 = "OMDB Error2";
                fs.appendFile("./log.txt", errorText2, function(error){
                    throw errorText2
                    console.log(errorText2);
                })
            return;
            }else{
                var output = "**********\n" + "Movie:\n" + "**********\n\n" + "Title: " + info.Title + "\n" + "Release Date: " + info.Released + "\n" + "IMBD Rating: " + info.imbdRating + "\n" + "Country of Origin: " + info.Country + "\n" + "Language: " + info.Language + "\n" +  "Plot: " + info.Plot + "\n" + "Actors: " + info.Actors + "\n" + "Country of Rotten Tomatoes Rating: " + info.tomatoRating + "\n" + "Rotten Tomatoes URL: " + info.tomatoURL + "\n";
                fs.appendFile("./log.txt", "LIRI:\n" + output + "\n", function(error){
                if(error){
                    throw error;
                }
                console.log(output);
                })
            }
        }
    })
}

function justDoIt(){
    fs.appendFile("./log.txt", "Command: liri.js do-what-it-says\n", function(error){
        if(error){
            throw error;
        }
    })
    fs.readFile("./random.txt", "utf8", function(error, data){
        if(error){
            console.log("Error Reading File");
            return;
        }else{
            var command = data.split(",");
            var action = command[0].trim();
            var parameters = command[1].trim();

            switch(command){
                case "my-tweets":
                    socialApp();
                    break;
                case "spotify-this-song":
                    musicApp(parameters);
                    break;
                case "movie-this":
                    movieApp(parameters);
                    break;
            }
        }
    })   
}

if(command === "my-tweets"){
    socialApp();
}else if(command === "spotify-this-song"){
    musicApp(stuffToDo);
}else if(command === "movie-this"){
    movieApp(stuffToDo);
}else if(command === "do-what-it-says"){
    justDoIt();
}else{
    fs.appendFile("./log.txt", "Command: " + node + "\n", function(error){
        if(error){
            throw error;
        }
        output = "History: \n" + " node liri.js my-tweets \n" + " node liri.js spotify-this-song \n" + " node liri.js movie-this \n" + " node liri.js do-what-it-says \n";
        fs.appendFile("./log.txt", "LIRI:\n" + output + "\n", function(error){
            if(error){
                throw error;
            }
            console.log(output);
        })
    })
}