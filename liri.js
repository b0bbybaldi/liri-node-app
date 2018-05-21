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

