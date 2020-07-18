import React, {useState} from 'react';
import logo from './Cornfedtrans.png';
import Id from './numerals/Id.png'
import Brod from './numerals/Brod.png'
import Hed from './numerals/Hed.png'
import Mad from './numerals/Mad.png'
import Sid from './numerals/Sid.png'
import Tal from './numerals/Tal.png'
import './App.css';

const BoardContext = React.createContext();

const numerals = [
  Tal,
  Hed,
  Brod,
  Id,
  Mad,
  Sid
]

const findColumnSums = (board) => {
  let sums = board.map( (row) => ( row.reduce((acc,cur) => (acc += cur)%6,0)))
  return sums
}

const findRowSums = (board) => {
  const addArrays = (arr2) => (cur,idx) => (cur+=arr2[idx])%6

const sumArrays = (arr1,arr2) => (
    arr1.map( addArrays(arr2))
  )
  let sums = board.reduce( (acc,row) => (sumArrays(acc,row)),[0,0,0])
  return sums
}

const arraysEqual = (a1,a2) => (JSON.stringify(a1)===JSON.stringify(a2))

function App() {
  const [board, setBoard] = useState([[0,1,2],[3,3,5],[0,7,0]])
  const [complexMode, setMode] = useState(false)
  const [showNumerals, setShowNumerals] = useState(false)
  const [rowSums, setRowSums] =useState(findRowSums(board))
  const [columnSums, setColumnSums] =useState(findColumnSums(board))
  const code = [5,3,2]
  const locked = [[0,0,0],[1,1,0],[1,0,1]]
  let solved = (arraysEqual(code,rowSums) && arraysEqual(code,columnSums))

  const renderBoard = (complexMode) => 
  (
    complexMode ?
      <div>
        <Lock board = {board}/>
        <SumColumn sums = {columnSums}/>
        <SumRow sums ={rowSums}/>
      </div>
      : <Lock board = {board}/>
  )

  const renderNumerals = (showNumerals) => (
    showNumerals ? 
    <div className = 'NumeralTable'>
        {numerals.map( (cur,idx) => (
          <div key = {idx} className = 'NumeralRow'>
            <Square className = 'Numeral' numeral ={idx} key ={idx}/>
            <h2 className = 'Key'>{idx}</h2>
          </div>
        ))}
    </div>
  : null
  )

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {solved?<h1>Congratulations! </h1>:
        <p>You have found a lock embedded in a wall that looks to be of Draconic make. Althought at first the symbols seem unfamiliar, you soon recognize them as the numerals Dragons use in their base 6 counting system. The inscription above the lock says in common: "These doors shall open for none other than the two hundredth descendant of the Great Dragon Celestian"</p>}
      </header>
      <BoardContext.Provider
        value = {{
          solved,
          locked,
          updateBoard: (row, square, val) => {
            let current = board.slice()
            current[row][square] = val
            setBoard(current)
            setColumnSums(findColumnSums(current))
            setRowSums(findRowSums(current))
          }
        }}
      >
        {renderNumerals(showNumerals)}
        {renderBoard(complexMode)}
      </BoardContext.Provider>
      <div className = "littleRoom">
        <button onClick = {() => {setMode(!complexMode)}} > {complexMode?'This is worse':'Need a hint?'}</button>
        <button onClick = {() => {setShowNumerals(!showNumerals)}}>Toggle Numerals</button>
      </div>
    </div>
  );
}

const Lock = (props) => (
  <div className = 'Lock'>
    {props.board.map( (cur,rowNum) => <LockRow row={cur} rowNum = {rowNum} key ={rowNum}/>)}
  </div>
  )

const LockRow = (props) => (
  <BoardContext.Consumer>
    {context => 
      <div className = 'LockRow'>
        {props.row.map( (cur,square) => (
            <Square 
              locked = {context.locked[props.rowNum][square] || context.solved}
              className = "LockSquare" 
              numeral = {cur} 
              rowNum = {props.rowNum} 
              key = {square} 
              callback = {() => context.updateBoard(props.rowNum,square,cur +1 % 6)}/>    
        ))}    
      </div>
    }
  </BoardContext.Consumer>
)

const SumRow = (props) => (
    <div className = 'SumRow'>
      {props.sums.map( (cur,idx) => <Square className = "SumRowSquare" numeral ={cur } key ={idx}/>)}
    </div>
  )

const SumColumn = (props) => (
    <div className = 'SumColumn'>
      {props.sums.map( (cur,idx) => <Square className = 'SumColumnSquare' numeral = {cur } key={idx}/>)}
    </div>
  )

const Square = (props) => {
  return(
        <div className = {props.className}>
          <img 
            className = {props.locked ? 'LockedSquare'  :'Square'}  
            alt = {props.numeral} 
            object-fit="cover" 
            src={numerals[props.numeral % 6]} 
            onClick = {!props.locked ? props.callback : null}
          />
        </div>
  )
}

export default App;
