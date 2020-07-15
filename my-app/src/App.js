import React, {useState} from 'react';
import logo from './logo.svg';
import Id from './numerals/Id.png'
import Brod from './numerals/Brod.png'
import Hed from './numerals/Hed.png'
import Mad from './numerals/Mad.png'
import Sid from './numerals/Sid.png'
import Tal from './numerals/Tal.png'
import Blank from './numerals/Blank.png'
import './App.css';

const BoardContext = React.createContext();

const arraysEqual = (a1,a2) => (JSON.stringify(a1)===JSON.stringify(a2))


function App() {
  const [board, setBoard] = useState([1,2,3,3,4,4,0,5,0])
  const restricted = [0,0,0,1,0,0,1,0,1]
  const solution = [2,1,2,3,0,0,0,2,0]
  let solved = arraysEqual(board,solution)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {solved
        ? <h1>Congratulations! </h1>
        : <p>There is an unusual lock on this wall with some familiar inscriptions</p>}
        <BoardContext.Provider
          value = {{
            current: board,
            restricted,
            solution,
            solved,
            updateBoard: (idx,val) => {
              let current = board.slice(0,idx).concat(val,board.slice(idx+1,board.length))
              setBoard( current)
            }
          }}
        >
          <Board/>
        </BoardContext.Provider>
        <br/>
        <br/>
      </header>
    </div>
  );
}

const numerals = [
  Tal,
  Hed,
  Brod,
  Id,
  Mad,
  Sid
]

const Board = (props) => {
  return ( 
    <div className= 'boardClass'>
      <GridRow iter = {0}/>
      <GridRow iter = {1}/>
      <GridRow iter = {2}/>
      <SumRow />
    </div>   
  )
}

const GridRow = (props) => (
  <div>
    <Square idx = {(props.iter * 3) + 0}/>
    <Square idx = {(props.iter * 3) + 1}/>
    <Square idx = {(props.iter * 3) + 2}/>
    <RowSum idx = {9+props.iter}/>
  </div>
)

const SumRow = (props) => (
  <div>
    <ColumnSum idx = {12}/>
    <ColumnSum idx = {13}/>
    <ColumnSum idx = {14}/>
    <EmptySquare idx = {15}/>
  </div>
)

const Square = (props) => {
  const handleClick = (context,idx) => ((context.solved || context.restricted[idx]) ? null : context.updateBoard(idx, (context.current[props.idx] + 1)%6))
  return(
    <BoardContext.Consumer>
      {context => 
      <button type="button" >
          <img className= 'square' src = {(numerals[context.current[props.idx]])} max-width = '100%' height = '100%' alt= {props.idx} onClick = {() => handleClick(context,props.idx)}/> 
        </button>   
      }
    </BoardContext.Consumer>
 ) 
}

const sliceBoard = (context,idx) => {
  let sliceStart = (idx-9)*3
return(
  context.current.slice(sliceStart,sliceStart+3).reduce( (acc,cur) => (acc+=cur),0)%6
)
}

const RowSum = (props) => {

  return(
    <BoardContext.Consumer>
      {context => 
        <button type="button" >
          <img className= 'square' src = {(numerals[sliceBoard(context,props.idx)])} max-width = '100%' height = '100%' alt= {props.idx} /> 
        </button>   
      }
    </BoardContext.Consumer>
 ) 
}

const verticalSlice = (context,i) => {
 return  context.current.reduce( (acc,cur,idx) => (
  (idx % 3) === (i - 12)
  ? acc += cur
  : acc
), 0 )% 6
}

const ColumnSum = (props) => {

  return(
    <BoardContext.Consumer>
      {context => 
        <button type="button" >
          <img className= 'square' src = {(numerals[verticalSlice(context,props.idx)])} max-width = '100%' height = '100%' alt= {props.idx} /> 
        </button>   
      }
    </BoardContext.Consumer>
 ) 
}

const EmptySquare = (props) => {
  return <button>
    <img className = 'square' src = {Blank} max-width = '100%' height = '100%' alt= {props.idx} />
  </button>
}

export default App;
