import * as React from 'react';
import './square.css';
//import Point from "./point";

export enum Color{
  BLACK = "BLACK",
  WHITE = "WHITE",
};


export enum SquareType{
  EMPTY = "EMPTY",
};

export type SquareState = SquareType | Color;

//白黒の組み合わせのみtrue
export const isOppositeColor = (firstSquare: SquareState, secondSquare: SquareState):boolean =>
{
  return(firstSquare === Color.BLACK && secondSquare === Color.WHITE
    || firstSquare === Color.WHITE && secondSquare === Color.BLACK)
  ;
}

export const getOppositeColor = <T extends Color>(square: T) =>{
  switch(square){
    case Color.BLACK:
      return Color.WHITE;
    case Color.WHITE:
      return Color.BLACK;
    default:
      return square;
  }
}

const getSymbolBySquareState= (state:SquareState, movableState:boolean):string =>{
  switch(state){
    case Color.BLACK:
      return "B";
    case Color.WHITE:
      return "W";
    case SquareType.EMPTY:
      return (movableState) ? "?":"";
    default:
      throw new Error('undefined SquareState symbol');
  }
}


export interface SquareProps{
  curState: SquareState;
  movableState: boolean;
  onClick: () => void;
}

//boardSize*boardSizeの大きさの盤を返す
export const squareInitialState = (boardSize:number):SquareState[] => {
  let initialState = Array(boardSize*boardSize).fill(SquareType.EMPTY)
  //boardSizeは偶数でなければならない
  const idx:number = boardSize/2 - 1;
  const idx2:number = boardSize/2;
  //真ん中に最初の石を並べる
  initialState[boardSize*idx+idx]=Color.WHITE;
  initialState[boardSize*idx2+idx2]=Color.WHITE;
  initialState[boardSize*idx+idx2]=Color.BLACK;
  initialState[boardSize*idx2+idx]=Color.BLACK;
  
  return initialState;
}

const Square = (props:SquareProps):JSX.Element =>{
  const img:string =getSymbolBySquareState(props.curState, props.movableState);
  return  <button className="square" onClick = {props.onClick}>
      {img}
    </button>
}

export default Square;