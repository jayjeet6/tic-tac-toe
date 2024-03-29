import Player from './components/Player.jsx'
import GameBoard from './components/GameBoard.jsx'
import {useState} from 'react'
import Log from './components/Log.jsx'
import { WINNING_COMBINATIONS } from './winning-combinations.js'
import GameOver from './components/GameOver.jsx'
const initialGameBoard=[
  [null,null,null],
  [null,null,null],
  [null,null,null],
];

function deriveActivePlayer(gameTurns){
  let currentPlayer='X';
  if(gameTurns.length>0 && gameTurns[0].player=== 'X'){
    currentPlayer='O';
  }
  return currentPlayer;
}
function App() {
  const[players,setPlayers]=useState({
    'X':'Player 1',
    'O':'Player 2'
  });
  const[gameTurns,setGameTurns]=useState([]);
  const activePlayer=deriveActivePlayer(gameTurns);
  let gameBoard=[...initialGameBoard.map(array => [...array])];
    for(const turn of gameTurns){
        const{square,player}=turn;
        const{row,col}=square;
        gameBoard[row][col]=player;
    }
    let winner;
    for(const combination of WINNING_COMBINATIONS){
      const firstSquare=gameBoard[combination[0].row][combination[0].column];
      const secondSquare=gameBoard[combination[1].row][combination[1].column];
      const thirdSquare=gameBoard[combination[2].row][combination[2].column];
      if(firstSquare && firstSquare==secondSquare && secondSquare==thirdSquare){
        winner=players[firstSquare];
      }
    }
    const gameDraw=gameTurns.length==9 && !winner;
    function handleRestart(){
      setGameTurns([]);
    }
    function handlePlayerNameChange(symbol,newName){
      setPlayers(prevPlayers =>{
        return{
          ...prevPlayers,
          [symbol]:newName

        };
      })

    }

  function handleSelectSquare(rowIndex,colIndex){
    setGameTurns((prevTurns)=>{
      const currentPlayer=deriveActivePlayer(prevTurns);
      const updatedTurns=[
        {square: { row:rowIndex,col:colIndex},player:currentPlayer},
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  return (
    <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <Player onChangeName={handlePlayerNameChange} initialName="Player1" symbol="X" isActive={activePlayer ==='X'}/>
          <Player onChangeName={handlePlayerNameChange} initialName="Player2" symbol="O" isActive={activePlayer ==='O'}/>
        </ol>
      { (winner || gameDraw) &&  <GameOver onRestart={handleRestart} winner={winner}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}  />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App
