
angular.module('ticTacToe', ['ngAnimate']).controller('TicTacToeController', function($timeout) {
  var ticTacToe = this; 
 
  
  ticTacToe.gameArr = [ // Basic 1D array for the gameboard.
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ];
  ticTacToe.game = [ // Game presentation
    ' ', ' ', ' ',
    ' ', ' ', ' ',
    ' ', ' ', ' '
  ];
  
  ticTacToe.moves = [];
  ticTacToe.reset = reset; // Make reset() available to the HTML
  ticTacToe.compFirst = compFirst; // Make compFirst() available to the HTML
  ticTacToe.play = play; // Make play() available to the HTML

  var turn = true; // Human starts first.
  var humanIsX = true; // Switches when computer goes first.
  
  function play(num) { // Human gives the move they would like to play.
    if (turn && moveIsAvailable(ticTacToe.gameArr, num)) { // If the move is available AND it is the human's turn,
      ticTacToe.gameArr[num] = 'X'; // place the 'X'.
      ticTacToe.game[num] = humanIsX? 'X':'O';
      turnOver(); // Computer's turn.
    } else {
      ticTacToe.words = "No!";
      return;
    }
    var result = winning(ticTacToe.gameArr, true, 0); // Check for a win or tie.
    if (result === -10) {
      ticTacToe.words = humanIsX?"X wins.":"O wins."; // Tell the world who won.
      $timeout(reset, 2000); // Resets after 2 Seconds
    } else if (result === 10) {
      ticTacToe.words = humanIsX?"O wins.":"X wins."; // Tell the world who won.
      $timeout(reset, 2000); // Resets after 2 Seconds
    } else if (result === 0) {
      ticTacToe.words = "Tie game."; // Tell the world it's a tie.
      $timeout(reset, 2000); // Resets after 2 Seconds
    } else { // If no end-game result,
      var compy = compMove(); // run the AI move-finding process.
      ticTacToe.gameArr[compy] = 'O'; // Make the move for the AI.
      ticTacToe.game[compy] = humanIsX? 'O':'X'; // Place the appropriate letter based on who is X
      if (winning(ticTacToe.gameArr) === 10) {
        ticTacToe.words = humanIsX?"O wins.":"X wins";
        $timeout(reset, 2000); // Resets after 2 Seconds
      } else if (winning(ticTacToe.gameArr) === 0) {
        ticTacToe.words = 'Tie game.';
        $timeout(reset, 2000); // Resets after 2 Seconds
      } else {
        turnOver(); // Human's turn.
      }
    }
  }

  function compFirst() { // Randomly pick between the corners for the AI's first move.
    if (ticTacToe.gameArr.indexOf('X') !== -1 || // Make sure a game is not in progress.
      ticTacToe.gameArr.indexOf('O') !== -1) {
      ticTacToe.words = "Game in progress.";
      return;
    }
    humanIsX = false;
    ticTacToe.words = "As you wish.";
    turnOver();
    var compy = Math.floor(Math.random() * (3) + 1);
    if (compy === 1) {
      ticTacToe.gameArr[0] = 'O';
      ticTacToe.game[0] = 'X';
    } else if (compy === 2) {
      ticTacToe.gameArr[4] = 'O';
      ticTacToe.game[4] = 'X';
    } else if (compy === 3) {
      ticTacToe.gameArr[6] = 'O';
      ticTacToe.game[6] = 'X';
    } else if (compy = 4) {
      ticTacToe.gameArr[8] = 'O';
      ticTacToe.game[8] = 'X';
    }
    turnOver(); // Plays like a regular game from here on out.
  }

  function compMove() {
    ticTacToe.moves = [];
    var move = undefined;
    var maxScore = -100; // Like stting the max score to -infinity
    for (var i = 0; i < ticTacToe.gameArr.length; i++) { // Loop through placements of O
      if (moveIsAvailable(ticTacToe.gameArr, i)) { // If the move is available,
        var trialArray = copyArray(ticTacToe.gameArr); // copy the array, and
        trialArray[i] = 'O'; // place an 'O'.
        var prediction = min(trialArray, 1); // Send to min to check for win (10 - turns) or tie (0).
        if (prediction > maxScore) { // If the prediction returned is more than -100,
          maxScore = prediction; // (it will be), change max score to the greatest value.
          move = i; // The move will be set to the move with the greatest possible score.
        }
        ticTacToe.moves.push([i, maxScore]);
      }
    }
    return move; // Returns the move.
  }

  function min(arr, turns) {
    if (winning(arr, false) === 0) { // Check if the previous move results in tie which will
      return 0; // return 0.
    } else if (winning(arr, false) === 10) { // Check if the previous move results in win for O
      return 10 - turns; // which returns 10 - number of turns.
    } else {
      var newTurns = 1 + turns;
      var minScore = 100; // Akin to setting the minScore to infinity
      for (var i = 0; i < arr.length; i++) { // Loop through placements of Xs
        if (moveIsAvailable(arr, i)) { // If the move is available,
          var trialArray = copyArray(arr); // copy the array, and
          trialArray[i] = 'X'; // place an 'X'.
          var prediction = max(trialArray, newTurns); // Send to max() to check for win(turns 0- 10) or tie (0).
          if (prediction < minScore) { // If the prediction returned is less than 100,
            minScore = prediction; // (and it will be), change minScore to the lowest value.
          }
        }
      }
      return minScore;
    }
  }

  function max(arr, turns, originalMove) {
    if (winning(arr, true) === -10) { // Check if the previous move will result in a win for X and
      return turns - 10; // return turns-10.
    } else if (winning(arr, false) === 0) { // Check if previous move will result in tie and
      return 0; // return 0;
    } else {
      var newTurns = 1 + turns;
      var maxScore = -100; // Like setting the max score to -infinity
      for (var i = 0; i < arr.length; i++) { // Loop through the placement of Os
        if (moveIsAvailable(arr, i)) { // If the move is available,
          var trialArray = copyArray(arr); // Create a unique copy of the array, and
          trialArray[i] = 'O'; // place an 'O'.
          var prediction = min(trialArray, newTurns); // Send to min() to check for win(10 - turns) or tie (0).
          if (prediction > maxScore) { // if the prediction returned is greater than -100,
            maxScore = prediction; // and it will be, change max score to the greatest value.
          }
        }
      }
      return maxScore;
    }
  }

  function copyArray(arr) { // Creates a copy of an array.
    return arr.slice();
  }

  function noMoreMoves(arr) { // If there are no available moves, return true.
    return arr.indexOf(' ') === -1 ? true : false;
  }

  function moveIsAvailable(arr, move) { // If the space is empty, return true.
    return arr[move] === ' ' ? true : false;
  }

  function turnOver() { // Change whether human's or computer's turn.
    turn = !turn;
  }

  function reset() { // Resets the game to original status.
    turn = true;
    ticTacToe.gameArr = [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    ticTacToe.game = [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    ticTacToe.moves = [];
    humanIsX = true;
    ticTacToe.words = 'In the wise words of Daft Punk, "...one more time..."'
  }

  function winning(trialArray, x) { // Checks for a win for X or O.
    var letter = undefined; // If X wins, return -10;
    if (x) { // if O wins, return 10;
      letter = 'X'
    } else {
      letter = 'O'
    }
    if (
      trialArray[0] === letter && // * * *
      trialArray[1] === letter && // ' ' '
      trialArray[2] === letter || // ' ' '

      trialArray[3] === letter && // ' ' '
      trialArray[4] === letter && // * * *
      trialArray[5] === letter || // ' ' '

      trialArray[6] === letter && // ' ' '
      trialArray[7] === letter && // ' ' '
      trialArray[8] === letter || // * * *

      trialArray[0] === letter && // * ' '
      trialArray[3] === letter && // * ' '
      trialArray[6] === letter || // * ' '

      trialArray[1] === letter && // ' * '
      trialArray[4] === letter && // ' * '
      trialArray[7] === letter || // ' * '

      trialArray[2] === letter && // ' ' *
      trialArray[5] === letter && // ' ' *
      trialArray[8] === letter || // ' ' *

      trialArray[0] === letter && // * ' '
      trialArray[4] === letter && // ' * '
      trialArray[8] === letter || // ' ' *

      trialArray[2] === letter && // ' ' *
      trialArray[4] === letter && // ' * '
      trialArray[6] === letter    // * ' '
    ) {
      if (x) {
        return -10;
      } else {
        return 10;
      }
    } else if (trialArray.indexOf(' ') === -1) {
      return 0;

    } else {
      return 'no';
    }
  }
});

var AWS = require('aws-sdk')
var AWSCognito = require('amazon-cognito-identity-js');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var poolData = {
  UserPoolId: 'us-east-1_ibYDmzY8b',
  ClientId: '1alp6a20v4emq85m529sennfsg'
};
