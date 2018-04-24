import * as React from 'react';
import Square, {SquareState} from "./square";
import './board.css';

export interface BoardProps{
  boardSize: number;
  rawBoard: SquareState[];
  movableStates: boolean[];
  onClick: (idx:number)=>void;
}

//１列のSquareを返す
const squareColumn = (props: BoardProps, columnNum:number) =>{
  let column:JSX.Element[]=[];
  for(let i:number =0; i<props.boardSize;++i){
    column.push(
      <Square
        curState = {props.rawBoard[columnNum*props.boardSize + i]}
        movableState = {props.movableStates[columnNum*props.boardSize + i]}
        onClick = {()=>props.onClick(columnNum*props.boardSize + i)}
      />
    )
  }
  return column;
}

const squareList = (props: BoardProps):JSX.Element[] =>{
  let list:JSX.Element[] = [];

  for(let i:number=0;i<props.boardSize ;++i){
  let column = squareColumn(props, i);
    list.push(
      <div className="board-row">
          {column}
      </div>
    );
  }
  return(
//    <div className = "board-list">
      list
//    </div>
  );
}


const Board = (props:BoardProps):JSX.Element =>{
  let list:JSX.Element[]=squareList(props);
  return(
    <div  className = "board-list">
      {list}
    </div>
  );
}

export default Board;