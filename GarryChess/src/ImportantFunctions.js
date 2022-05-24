import { Chess } from 'chess.js';

const axios = require('axios');

export async function getBestMove(rootPos) {
    let rootFenCleaned = rootPos.split(' ').slice(0,3).join(' ');
    let response = await axios.get('https://lichess.org/api/cloud-eval', {
        params: {
          fen: rootFenCleaned
        }
      });
    let result = response.data.pvs[0].moves.split(" ")[0];
    return result;
}

export async function getELOspecificMoves(rootPos, elo){
    let rootFenCleaned = rootPos.split(' ').slice(0,3).join(' ');
    let response = await axios.get('https://explorer.lichess.ovh/lichess', {
        params: {
          fen: rootFenCleaned,
          speed: 'blitz',
          moves: 3,
          ratings: [elo-50, elo+50],
        }
      });
    let numMoves = response.data.moves.length;
    let result = [response.data.moves[0].uci];
    if (numMoves > 1)
      result.push(response.data.moves[1].uci);
    if (numMoves > 2)
      result.push(response.data.moves[2].uci);
    return result;
}

export async function generatePositions(rootPos, color, eloLevel) {
    let game = new Chess(rootPos);
    let allPositions = [];

    let positions = [rootPos];
    let newPositions = [];

    if (game.turn() == color){
      allPositions.push(rootPos);
    }
    for (let i = 0; i<5; i++)
    {
      for (let position of positions)
      {
        game.load(position);
        
        if (game.turn() == color){
          game.load(position);
          let move = await getBestMove(position);
          game.move({ from: move.slice(0,2), to: move.slice(2,4) });
          newPositions.push(game.fen());
        }else {
          let moves = await getELOspecificMoves(position, eloLevel);
          for (let move of moves)
          {
            game.load(position);
            game.move({ from: move.slice(0,2), to: move.slice(2,4) });
            newPositions.push(game.fen());
            allPositions.push(game.fen());
          }
        }
      }
      positions = newPositions;
      newPositions = [];
    }
    return allPositions;
}