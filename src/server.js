const express = require('express');
const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const server_port = 3000
const server_ip_address = 'localhost'

const connection_string = 'mongodb://localhost:27017/dota2fl';
const db = require('mongoskin').db(connection_string);

const leagueRoutes = require('./js/routes/league');
const userRoutes = require('./js/routes/user');
const teamRoutes = require('./js/routes/team')

const dbHelp = require('./js/helpers/dbHelper.js');
const builder = require('./js/helpers/jsonBuilder.js')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use('/league', leagueRoutes);
app.use('/user', userRoutes);
app.use('/team', teamRoutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//Get a league from the database
app.get('/getLeagueData/', function(req, res){
    findLeagueDB("leagues", function(result){
        res.send(result);
    });
});

// Returns all the teams that a specific user has
app.get('/getUserTeamData/:id', function(req, res){
  dbHelp.findDataDB("users", req.params.id, "email", function(result){
    res.send(result["data"]["teams"]);
  });
});

// Returns pro players from the Players DB
app.get('/getPlayers', function(req, res) {
    findPlayersDB(res, function(result){
      res.send(result);
    });
  });

// Returns a pro player from the Players DB depending on the player_id
app.get('/getPlayerData/:player_id', function(req, res){
  findPlayerDB(res,req.params.player_id, function(result){
    res.send(result);
  });
});

// Returns a hero from the Heroes DB depending on the hero_id
app.get('/getHero/:id', function(req, res){
  findHeroDB(res,parseInt(req.params.id), function(result){
    res.send(result);
  });
});

// Resets the database and adds heroes and pro players to Heroes DB and Players DB
app.get('/init_db', function(req, res) {
  emptyDB(function(){
    getDataFromSteam("heroes", URLMaker("IEconDOTA2","GetHeroes",""), function(){
      getDataFromSteam("players", URLMaker("IDOTA2Fantasy","GetProPlayerList",""), function(){
        console.log("Initiated database");
      });
    });
  });
  res.send("Database Initiated");
});

/*
        STEAM FUNCTIONALITY
*/

var URLMaker = function(interfaces, method, params){
  return "http://api.steampowered.com/" + interfaces + "_570/" + method + "/v1/?key=EE70174C7C4701D6FB1C6C3DFCBECE73" + params;
}

var getDataFromSteam = function(data_type, url, callback){
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      console.log("Downloaded " + data_type + " from Steam");
      insertDB(data_type, xhttp.responseText);
      callback();
    }
    else{
      console.log("Something went wrong when downloading " + data_type + " from Steam");
    }
  }
};

var emptyDB = function(callback){
  db.collection('heroes').remove();
  db.collection('players').remove();
  db.collection('users').remove();
  db.collection('leagues').remove();
  callback();
};

/*
        INSERT INTO DATABASE
*/

var insertDB = function(data_type, data){
  var data = JSON.parse(data);
  switch (data_type) {
    case "heroes":
      insertHeroesDB(data);
      console.log("heroess");
      break;
    case "players":
      insertProPlayerDB(data);
      console.log("players");
      break;
    default:
      break;
  }
}

var insertHeroesDB = function(data){
  var heroes = data["result"]["heroes"];

  for (i = 0; i < heroes.length; i++){
    hero_name = heroes[i]["name"];
    hero_id = heroes[i]["id"];
    hero_name = hero_name.slice(14,hero_name.length);
    db.collection('heroes').insert({name: hero_name, dota_id: hero_id});
  }
};

var insertProPlayerDB = function(data){
  var players = data["player_infos"];

  for (i = 0; i < players.length; i++){
    if (players[i]["is_locked"] == true){
      player_account_id = players[i]["account_id"];
      player_name = players[i]["name"];
      player_country = players[i]["country_code"];
      player_role = players[i]["fantasy_role"];
      player_team_id = players[i]["team_id"];
      player_team = players[i]["team_name"];
      db.collection('players').insert({account_id: player_account_id, name: player_name, country: player_country, role: player_role, team_id: player_team_id, team:player_team});
    }
  }
}

/*
        FIND IN DATABASE
*/

var findPlayerDB = function(res, player, callback){
  db.collection('players').find({name:player}).toArray(function(err,result){
    if (err) throw err;
    response = builder.json(result,true);
    callback(response);
  });
};

var findPlayersDB = function(res, callback){
    db.collection('players').find().toArray(function(err,result){
      if (err) throw err;
      response = builder.json(result,true);
      callback(response);
    });
};

var findLeagueDB = function(res, callback){
    db.collection('leagues').find().toArray(function(err,result){
      if (err) throw err;
      response = builder.json(result,true);
      callback(response);
    });
};

var findHeroDB = function(res, hero_id, callback){
  db.collection('heroes').find({dota_id:hero_id}).toArray(function(err,result){
    if (err) throw err;
    response = builder.json(result,true)
    callback(response);
  });
};

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
