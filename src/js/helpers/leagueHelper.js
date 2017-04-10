const express = require('express');
const connection_string = 'mongodb://localhost:27017/dota2fl';
const db = require('mongoskin').db(connection_string);
const builder = require('./jsonBuilder.js');
const user = require('./userHelper.js');

exports.create = function (data, callback) {
	let league = data["league"];
	let team = data["team"];
	leagueFindLeague(league["name"], function (result) {
		if (result["success"] == false) {
			db.collection("leagues").insert(league);
			//user.updateLeague(team, exports.updateParticipant);
            user.updateLeague(team, function () {
                let response = builder.json("League created", true);
                callback(response);
            });
		} else {
			let response = builder.json("League occupied", false);
            callback(response);
		}
	});
}

exports.addUser = function (team, callback) {
	leagueFindLeague(team["league"], function (result) {
		if (result["success"] == true) {
			user.updateLeague(team, exports.updateParticipant);
		} else {
			console.log(result["data"]);
		}
		callback(result);
	});
}

exports.removeUser = function (data, callback) {
    db.collection("leagues").update({name: data["league"]}
    , {"$pull": {participants: data["user"]}}, function (err, result) {
        if (err) throw err;
        let response = builder.json("Successfuly removed user from league", true);
        leagueDeleteEmpty(data, function() {
            callback(response);
        });
    });
}

exports.updateParticipant = function (team) {
	leagueFindParticipant(team, function (result) {
		if (result["success"] == false) {
			db.collection("leagues").update({name: team["league"]}, 
			{"$push": {participants: team["owner"]}}, function (err, result) {
				if (err) throw err;
			});
		} else {
			console.log(result["data"]);
		}
	});
}

let leagueDeleteEmpty = function (data, callback) {
    db.collection("leagues").find({name: data["league"]}).toArray(function (err, result) {
        result = result[0]["participants"];
        if (result.length == 0) {
            db.collection("leagues").remove({name: data["league"]}, function (err, result) {
                if (err) throw err;
                callback();
            });
        } else {
            callback();
        }
    });
}

let leagueFindLeague = function (league, callback) {
	db.collection("leagues").findOne({name: league}, function (err, result) {
		if (err) throw err;
		if (result == null || result.length == 0) {
			let response = builder.json("League not found", false);
			console.log("League not found");
		} else {
			let response = builder.json("League found", true);
			console.log("League found");
		}
		callback(response);
	});
}

let leagueFindParticipant = function (team, callback) {
	db.collection("leagues").find({"$and": [{participants: team["owner"]}
	, {name: team["league"]}]}).toArray(function (err, result) {
		if (err) throw err;
		if (result == null || result.length == 0) {
			let response = builder.json("Participant not found", false);
		} else {
			let response = builder.json("Participant found", true);
		}
		callback(response);
	});
}