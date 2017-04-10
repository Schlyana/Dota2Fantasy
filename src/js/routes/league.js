const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const league = require('../helpers/leagueHelper.js');
const user = require('../helpers/userHelper.js');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next();
});

router.get('/', function (req, res) {
	res.send("Test");
});

router.post('/create/', function (req, res) {
	let data = req.body["data"];
	league.create(data, function (result) {
		res.send(result);
	});
});

router.post('/addUser/', function (req, res) {
	let data = req.body["data"];
	league.addUser(data["team"], function(result) {
		res.send(result);
	});
});

router.post('/removeUser/', function (req, res) {
	let data = req.body["data"];
	league.removeUser(data, function (result) {
		user.removeLeague(data, function () {
			user.removeTeam(data, function () {
				res.send(result);
			});
		});
	});
});

router.get('/getData', function (req, res) {

})

module.exports = router;