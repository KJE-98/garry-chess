import { Chess } from 'chess.js';

const axios = require('axios');

export async function getBestMove(rootPos) {
  try{
    let rootFenCleaned = rootPos.split(' ').slice(0,3).join(' ');
    let response = await axios.get('https://lichess.org/api/cloud-eval', {
        params: {
          fen: rootFenCleaned
        }
      });
    let result = response.data.pvs[0].moves.split(" ")[0];
    console.log(result);
    return cleanBestMove(rootPos, result);
  } catch (e) {
    return false;
  }
}

export async function getELOspecificMoves(rootPos, elo){
  try{
    let rootFenCleaned = rootPos.split(' ').slice(0,3).join(' ');
    let response = await axios.get('https://explorer.lichess.ovh/lichess', {
        params: {
          fen: rootFenCleaned,
          speed: 'blitz',
          moves: 3,
          ratings: [elo-100, elo],
        }
      });
    let numMoves = response.data.moves.length;
    let result = [response.data.moves[0].uci];
    if (numMoves > 1)
      result.push(response.data.moves[1].uci);
    if (numMoves > 2)
      result.push(response.data.moves[2].uci);
    return result.map((move)=>cleanBestMove(rootPos,move));
  } catch (e) {
    return false;
  }
}

export async function generatePositions(rootPos, color, eloLevel) {
    let game = new Chess(rootPos);
    let allPositions = [];

    let positions = [rootPos];
    let newPositions = [];

    if (game.turn() === color){
      allPositions.push(rootPos);
    }
    for (let i = 0; i<6; i++)
    {
      for (let position of positions)
      {
        game.load(position);
        
        if (game.turn() === color){
          game.load(position);
          let move = await getBestMove(position);
          if (!move){
            continue;
          }
          game.move({ from: move.slice(0,2), to: move.slice(2,4) });
          newPositions.push(game.fen());
        }else {
          let moves = await getELOspecificMoves(position, eloLevel);
          if (!moves){
            continue;
          }
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

// move is assumed to be valid
function cleanBestMove(fen, move){
  let game = new Chess(fen);
  if (move.slice(0,2) === 'e1' && game.get('e1').type === 'k' && game.get('e1').color === 'w' && move.slice(2,4) === 'h1'){
    return 'e1g1'
  }
  else if (move.slice(0,2) === 'e1' && game.get('e1').type === 'k' && game.get('e1').color === 'w' && move.slice(2,4) === 'a1'){
    return 'e1c1'
  }
  else if (move.slice(0,2) === 'e8' && game.get('e8').type === 'k' && game.get('e8').color === 'b' && move.slice(2,4) === 'h8'){
    return 'e8g8'
  }
  else if (move.slice(0,2) === 'e8' && game.get('e8').type === 'k' && game.get('e1').color === 'b' && move.slice(2,4) === 'a8'){
    return 'e8c8'
  }
  return move;
}

export let defaultPositions = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq d6 0 2",
  "rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2",
  "rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1R w KQkq c6 0 2",
  "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 1 3",
  "rnbqkbnr/ppp2ppp/4p3/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3",
  "r1bqkbnr/ppp1pppp/2n5/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 1 3",
  "rnbqkb1r/pppppp1p/5np1/8/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3",
  "rnbqkb1r/pppp1ppp/4pn2/8/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3",
  "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq c6 0 3",
  "r1bqkbnr/pp1ppppp/2n5/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 1 3",
  "rnbqkb1r/pp1ppppp/5n2/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 1 3",
  "rnbqkbnr/pp1p1ppp/4p3/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R w KQkq - 0 3",
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "rnbqkb1r/ppp1pppp/5n2/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 1 4",
  "rnbqkbnr/pp3ppp/2p1p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "rnbqkbnr/pp3ppp/4p3/2pp4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq c6 0 4",
  "r1bqkbnr/ppp1pppp/2n5/8/2pP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "r2qkbnr/ppp1pppp/2n5/3p4/2PP2b1/5N2/PP2PPPP/RNBQKB1R w KQkq - 1 4",
  "r1bqkbnr/ppp2ppp/2n1p3/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 4",
  "rnbqk2r/ppppppbp/5np1/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 2 4",
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq d6 0 4",
  "rnbqkb1r/ppp1pp1p/3p1np1/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "rnbqkb1r/ppp2ppp/4pn2/3p4/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq d6 0 4",
  "rnbqk2r/pppp1ppp/4pn2/8/1bP5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 2 4",
  "rnbqkb1r/p1pp1ppp/1p2pn2/8/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "r1bqkb1r/pp1ppppp/2n2n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 2 4",
  "rnbqkb1r/pp1ppp1p/5np1/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "rnbqkb1r/pp1p1ppp/4pn2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "r1bqkbnr/pp1ppp1p/2n3p1/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "r1bqkb1r/pp1ppppp/2n2n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 3 4",
  "r1bqkbnr/pp1p1ppp/2n1p3/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "r1bqkb1r/pp1ppppp/2n2n2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 3 4",
  "rnbqkb1r/pp1ppp1p/5np1/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "rnbqkb1r/pp1p1ppp/4pn2/2p5/2P5/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 4",
  "r1bqkbnr/pp1p1ppp/2n1p3/2p5/2P5/5NP1/PP1PPP1P/RNBQKB1R w KQkq - 1 4",
  "rnbqkb1r/pp1p1ppp/4pn2/2p5/2P5/5NP1/PP1PPP1P/RNBQKB1R w KQkq - 1 4",
  "rnbqkbnr/pp3ppp/4p3/2pp4/2P5/5NP1/PP1PPP1P/RNBQKB1R w KQkq d6 0 4",
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rn1qkb1r/pp2pppp/2p2n2/3p4/2PP2b1/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5",
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 0 5",
  "rn1qkb1r/pp2pppp/2p2n2/3p1b2/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5",
  "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 0 5",
  "rn1qkb1r/ppp1pppp/5n2/8/2pP2b1/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5",
  "rnbqkb1r/p1p1pppp/5n2/1p6/2pP4/4PN2/PP3PPP/RNBQKB1R w KQkq b6 0 5",
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 3 5",
  "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 3 5",
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5",
  "rnbqkbnr/pp4pp/2p1p3/3p1p2/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq f6 0 5",
  "rnbqk1nr/pp3ppp/2pbp3/3p4/2PP4/4PN2/PP3PPP/RNBQKB1R w KQkq - 1 5",
  "rnbqkbnr/pp3ppp/8/2pp4/3P4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 5",
  "rnb1kbnr/pp3ppp/4p3/2pq4/3P4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 5",
  "rnbqkbnr/pp3ppp/4p3/3P4/3p4/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 5",
  "r2qkbnr/ppp1pppp/2n5/8/2pP2b1/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "r1bqkb1r/ppp1pppp/2n2n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "r1bqkbnr/ppp2ppp/2n1p3/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r2qkbnr/ppp1pppp/2n5/3P4/3P4/5b2/PP2PPPP/RNBQKB1R w KQkq - 0 5",
  "r3kbnr/ppp1pppp/2n5/3q4/3P2b1/5N2/PP2PPPP/RNBQKB1R w KQkq - 0 5",
  "r2qkbnr/ppp1pppp/8/3P4/1n1P2b1/5N2/PP2PPPP/RNBQKB1R w KQkq - 1 5",
  "r1bqkb1r/ppp2ppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "r1bqk1nr/ppp2ppp/2n1p3/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 5",
  "r1bqkbnr/ppp2ppp/2n1p3/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqk2r/ppp1ppbp/3p1np1/8/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 0 5",
  "rnbq1rk1/ppppppbp/5np1/8/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQ - 1 5",
  "rnbqk2r/pp1pppbp/5np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq c6 0 5",
  "rnbqkb1r/ppp1pp1p/6p1/3n4/8/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqk2r/ppp1ppbp/5np1/3P4/8/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 1 5",
  "rnbqkb1r/pp2pp1p/2p2np1/3P4/8/2N2N2/PP1PPPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqk2r/ppp1ppbp/3p1np1/8/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "rnbqkb1r/ppp2p1p/3p1np1/4p3/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq e6 0 5",
  "rnbqkb1r/pp2pp1p/3p1np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq c6 0 5",
  "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 1 5",
  "rnbqk2r/ppp2ppp/4pn2/3p4/1bPP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 1 5",
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rnbq1rk1/pppp1ppp/4pn2/8/1bP5/2N2N2/PPQPPPPP/R1B1KB1R w KQ - 4 5",
  "rnbqk2r/p1pp1ppp/1p2pn2/8/1bP5/2N2N2/PPQPPPPP/R1B1KB1R w KQkq - 0 5",
  "rnbqk2r/pp1p1ppp/4pn2/2p5/1bP5/2N2N2/PPQPPPPP/R1B1KB1R w KQkq c6 0 5",
  "rn1qkb1r/pbpp1ppp/1p2pn2/8/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "rn1qkb1r/p1pp1ppp/bp2pn2/8/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "rnbqk2r/p1pp1ppp/1p2pn2/8/1bP5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "r1bqkb1r/pp1ppppp/2n2n2/8/2Pp4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqkb1r/pp2pp1p/3p1np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 0 5",
  "rnbqk2r/pp1pppbp/5np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "rnbqkb1r/pp3ppp/4pn2/2pp4/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq d6 0 5",
  "rnbqkb1r/p2p1ppp/1p2pn2/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "r1bqk1nr/pp1pppbp/2n3p1/2p5/2P5/2N1PN2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2P5/2N1PN2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "r1bqkbnr/pp1p1p1p/2n3p1/2p1p3/2P5/2N1PN2/PP1P1PPP/R1BQKB1R w KQkq e6 0 5",
  "r1bqkb1r/pp1ppppp/2n2n2/8/2Pp4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "r1bqkbnr/pp3ppp/2n1p3/2pp4/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq d6 0 5",
  "r1bqkbnr/1p1p1ppp/p1n1p3/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1ppppp/2n2n2/8/2Pp4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5",
  "rnbqkb1r/pp2pp1p/3p1np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 0 5",
  "rnbqk2r/pp1pppbp/5np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "r1bqkb1r/pp1ppp1p/2n2np1/2p5/2P1P3/2N2N2/PP1P1PPP/R1BQKB1R w KQkq - 1 5",
  "rnbqkb1r/pp3ppp/4pn2/2pp4/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq d6 0 5",
  "rnbqkb1r/p2p1ppp/1p2pn2/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2P5/2N2NP1/PP1PPP1P/R1BQKB1R w KQkq - 1 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq - 3 5",
  "r1bqkbnr/pp3ppp/2n1p3/2pp4/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq d6 0 5",
  "r1bqkbnr/pp1p1p1p/2n1p1p1/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq - 0 5",
  "r1bqkb1r/pp1p1ppp/2n1pn2/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq - 3 5",
  "rnbqkb1r/pp3ppp/4pn2/2pp4/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq d6 0 5",
  "rnbqk2r/pp1pbppp/4pn2/2p5/2P5/5NP1/PP1PPPBP/RNBQK2R w KQkq - 3 5",
  "rnbqkbnr/pp3ppp/8/2pp4/8/5NP1/PP1PPP1P/RNBQKB1R w KQkq - 0 5",
  "rnb1kbnr/pp3ppp/4p3/2pq4/8/5NP1/PP1PPP1P/RNBQKB1R w KQkq - 0 5",
  "rnbqkb1r/pp3ppp/4pn2/2pP4/8/5NP1/PP1PPP1P/RNBQKB1R w KQkq - 1 5"
];