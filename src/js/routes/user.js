const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const dbHelp = require('../helpers/dbHelper.js')

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.use(function timeLog (req, res, next) {
	console.log('Time: ', Date.now())
	next();
});

router.post('/register/', function (req, res) {
    dbHelp.registerDataDB("users", req.body["user"], "email", function(result){
        res.send(result);
    });
});

router.get('/getData/:id', function (req, res) {
    dbHelp.findDataDB("users", req.params.id ,"email", function(result){
        res.send(result);
    });
});

module.exports = router;
