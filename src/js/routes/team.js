const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const dbHelp = require('../helpers/dbHelper.js');
const team = require('../helpers/teamHelper.js');
const builder = require('../helpers/jsonBuilder.js');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next();
});

router.post('/register/', function (req, res) {
    let teams = req.body["team"];
    dbHelp.registerDataDB("teams", teams, "name", function(result){
        ans = JSON.parse(result);
        if (ans["success"]){
            team.registerUser(teams, function(response){
                res.send(result);
            });
        } else {
            res.send(result);
        }
    });
});

router.post('/registerPlayer/', function (req, res) {
    let data = req.body["data"];
    team.registerPlayer(data, function(result){
        res.send(result);
    });
});

router.post('/unregisterPlayer/', function (req, res) {
    let data = req.body["data"];
    team.unregisterPlayer(data, function(result){
        res.send(result);
    });
});

router.get('/getData/:id', function (req, res) {
    dbHelp.findDataDB("users", req.params.id, "email", function(result){
        res.send(result["data"]);
    });
});

module.exports = router;