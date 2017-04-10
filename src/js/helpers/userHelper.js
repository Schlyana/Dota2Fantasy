const express = require('express');
const connection_string = 'mongodb://localhost:27017/dota2fl';
const db = require('mongoskin').db(connection_string);
const builder = require('./jsonBuilder.js');
const league = require('./leagueHelper.js');

exports.updateLeague = function (team, callback) {
	console.log("UpdateLeague");
	exports.findLeague(team, function (result) {
		if (result["success"] == false) {
			db.collection("users").update({email: team["owner"]}
			, {"$push": {leagues: team["league"]}}, function (err, result) {
				if (err) throw err;
			});
		} else {
			console.log(result["data"]);
		}
		league.updateParticipant(team);
        callback();
	});
}

exports.removeLeague = function (data, callback) {
    db.collection("users").update({email:data["user"]}
    , {"$pull": {leagues: data["league"]}}, function (err, result) {
        if (err) throw err;
        callback();
    });
}

exports.removeTeam = function (data, callback) {
	db.collection("users").update({email : data["user"]}
	, {"$pull": {teams: data["team"]}}, function (err, result) {
		if (err) throw err;
		callback();
	})
}

exports.findLeague = function (team, callback) {
	db.collection("users").find({"$and": [{email: team["owner"]}
	, {leagues: team["league"]}]}).toArray(function (err,result) {
		if (err) throw err;
		if (result == null || result.length == 0) {
			let response = builder.json("User league not found", false);
		} else {
			let response = builder.json("User league found", true);
		}
		callback(response);
	});
}