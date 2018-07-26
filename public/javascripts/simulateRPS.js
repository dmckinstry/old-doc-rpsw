'use strict';

const startGamePath = '/api/game/create';
const scoreRoundPath = '/api/game/score';
const finishGamePath = '/api/game/complete';
const getPlayPath = '/api/rpssimulator';

const rpsValues = ['Rock', 'Paper', 'Scissors'];

var team1Name = '';
var team1Selects = 0;
var team2Name = '';
var team2Selects = 0;
var gameId = '';

// ----------
function getTeamName(name) {
    var url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return name;
    if (!results[2]) return name;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setResultsText(text) {
    $('#resultsText').html(text);
}

function appendResultsText(text) {
    var newText = $('#resultsText').html() + '<br/>' + text;
    setResultsText(newText);
}

function startGame() {
    team1Name = $('#team1Text').val();
    team2Name = $('#team2Text').val();

    var url = new URL(startGamePath, gameManagerHost);

    url.searchParams.append('team1', team1Name);
    url.searchParams.append('team2', team2Name);
    url.searchParams.append('count', 5);

    fetch(url)
        .then((resultPromise) => resultPromise.json())
        .then((result) => {
            gameId = result;
            setResultsText('Game ID = ' + gameId);
            simulateRound();
        });
}

function simulateRound() {
    var url = new URL(getPlayPath, playerSimulatorHost);
    fetch(url)
        .then((resultPromise) => resultPromise.text())
        .then((result) => {
            team1Selects = result;
            var roundResults = ' [ ' + team1Name + ' chooses ' + rpsValues[team1Selects];

            var url = new URL(getPlayPath, playerSimulatorHost);
            fetch(url)
                .then((resultPromise) => resultPromise.text())
                .then((result) => {
                    team2Selects = result;
                    roundResults += ' and ' + team2Name + ' chooses ' + rpsValues[team2Selects];

                    var url = new URL(getPlayPath + '/' + team1Selects + '-' + team2Selects, playerSimulatorHost);
                    fetch(url)
                        .then((resultPromise) => resultPromise.text())
                        .then((result) => {
                            var message = roundResults + ' ] --- '
                            if (result === '0') message += 'It is a tie';
                            else if (result === '1') message += team1Name + ' wins!';
                            else if (result === '2') message += team2Name + ' wins!';

                            appendResultsText(message);
                            scoreRound(result);
                        });
                });
        });
}

function scoreRound(winningTeam) {
    var url = new URL(scoreRoundPath, gameManagerHost);
    url.searchParams.append('id', gameId);
    url.searchParams.append('winningTeam', winningTeam);
    fetch(url)
        .then((resultPromise) => resultPromise.text())
        .then((result) => {
            if (result === 'true')
                completeGame();
            else
                simulateRound();
        });
}

function completeGame() {
    var url = new URL(finishGamePath, gameManagerHost);
    url.searchParams.append('id', gameId);
    fetch(url)
        .then((resultPromise) => resultPromise.text())
        .then((result) => {
            var finalMessage = '*** CONGRATULATIONS TO '
                + result.toUpperCase() + ' FOR WINNING THE TOURNAMENT! ***';

            appendResultsText(finalMessage);
        });
}
