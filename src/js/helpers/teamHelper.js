const express = require('express');
const connection_string = 'mongodb://localhost:27017/dota2fl';
const db = require('mongoskin').db(connection_string);
const builder = require('./jsonBuilder.js');

exports.registerUser = function(data, callback){
  db.collection('users').find({'$and': [{email:data["owner"]}, {teams:data["name"]}]}).toArray(function(err, result){
    if (err) throw err;
    if (result.length === null || result.length === 0){
      db.collection('users').update({email:data["owner"]}, {'$push':{teams:data["name"]}}, function(err){
        if (err) throw err;
        result = builder.json("Added team to user", true);
        callback(result);
      });
    }
    else{
      result = builder.json("User already has team", false);
      callback(result);
    }
  });
};

exports.registerPlayer = function(data, callback) {

    db.collection('teams').find({'$and': [{name:data["team"]}, {owner:data["user"]}]}).toArray(function(err, result){
      if (err) throw err;
      if (result.length != 0){
        if (result[0].players.length > 4) {
            result = builder.json("The team is full", false);
            callback(result);
            return;
        }
        db.collection('teams').update({'$and': [{name:data["team"]}, {owner:data["user"]}]}, {'$push':{players:data["player"]}}, function(err){
          if (err) throw err;
          result = builder.json("Added player to team", true);
          callback(result);
        });
      }
      else {
        result = builder.json("Player is already in the team", false);
        callback(result);
      }
    });
};

exports.unregisterPlayer = function(data, callback) {

    db.collection('teams').find({'$and': [{name:data["team"]}, {owner:data["user"]}]}).toArray(function(err, result){
      if (err) throw err;
      if (result.length != 0){
        db.collection('teams').update({'$and': [{name:data["team"]}, {owner:data["user"]}]}, {'$pull':{players:data["player"]}}, function(err){
          if (err) throw err;
          result = builder.json("Removed player from team", true);
          callback(result);
        });
      }
    });
};