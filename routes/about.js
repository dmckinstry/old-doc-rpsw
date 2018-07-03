'use strict';
var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();


var gameManagerHost = process.env.MANAGER_SERVICE_HOST; // || 'http://tmprpsservice.azurewebsites.net';
var gameManagerVersion = 'Undefined';
var rpsSimulatorHost = process.env.RPS_SERVICE_HOST; // || 'http://tmprpsservice.azurewebsites.net';
var rpsSimulatorVersion = 'Undefined';


function getManagerInfo(res) {
    if (gameManagerHost) {
        var url = gameManagerHost + '/api/version';
        fetch(url)
            .then((resultPromise) => resultPromise.text())
            .then((result) => {
                gameManagerVersion = result;
                getSimulatorInfo(res);
            })
            .catch(err => {
                console.error(err);
                getSimulatorInfo(res);
            });
    }
    else {
        getSimulatorInfo(res);
    }
}


function getSimulatorInfo(res) {
    if (rpsSimulatorHost) {
        var url = rpsSimulatorHost + '/api/version';
        fetch(url)
            .then((resultPromise) => resultPromise.text())
            .then((result) => {
                rpsSimulatorVersion = result;
                renderAbout(res);
            })
            .catch(err => {
                console.error(err);
                renderAbout(res);
            });
    } 
    else {
        renderAbout(res);
    }
}

function renderAbout(res) {
    res.render('about', { 
        title: 'Rock Paper Scissors simulator', 
        managerHost: gameManagerHost,
        managerVersion: gameManagerVersion,
        simulatorHost: rpsSimulatorHost,
        simulatorVersion: rpsSimulatorVersion
     });
}


/* GET home page. */
router.get('/', function (req, res) {
    getManagerInfo(res);
});

module.exports = router;
