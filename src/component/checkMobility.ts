import direction from "./direction";
import Point, {addPoints,isInBoard,getIndexByPoint} from "./point";
import {SquareState, Color, isOppositeColor, SquareType} from "./square";

export interface Disc{
  point: Point;
  color: Color;
}

export const directionVector: {
  direction: direction,
  vector: Point,
}[] = [
  {
    direction: direction.UPPER,
    vector: {
      x: 0,
      y: -1
    }
  },
  {
    direction: direction.LOWER,
    vector: {
      x: 0,
      y: 1
    }
  },
  {
    direction: direction.LEFT,
    vector: {
      x: -1,
      y: 0
    }
  },
  {
    direction: direction.RIGHT,
    vector: {
      x: 1,
      y: 0
    }
  },
  {
    direction: direction.UPPER_RIGHT,
    vector: {
      x: 1,
      y: -1
    }
  },
  {
    direction: direction.UPPER_LEFT,
    vector: {
      x: -1,
      y: -1
    }
  },
  {
    direction: direction.LOWER_LEFT,
    vector: {
      x: -1,
      y: 1
    }
  },
  {
    direction: direction.LOWER_RIGHT,
    vector: {
      x: 1,
      y: 1
    }
  },
]
//ひっくり返せる方向を返す。direcitonとのorで取り出す。
const checkMobility = (disc:Disc, rawBoard:SquareState[], boardSize: number) =>{
  let mobility:number =direction.NONE;
  //すでに石が置いてあれば、何もひっくり返せないと返す。
  if(rawBoard[getIndexByPoint(disc.point, boardSize)] !== SquareType.EMPTY){
    return mobility;
  }
  directionVector.forEach(
    (element)=>{
      let nextPoint :Point = addPoints(disc.point, element.vector)
      if(!isOppositeColor(disc.color, rawBoard[getIndexByPoint(nextPoint,boardSize)])){
        return;
      }
      while( isInBoard(nextPoint, boardSize)
        &&  isOppositeColor(disc.color, rawBoard[getIndexByPoint(nextPoint, boardSize)])){
          nextPoint = addPoints(nextPoint, element.vector);
      }
      if(isInBoard(nextPoint, boardSize)
       && disc.color === rawBoard[getIndexByPoint(nextPoint, boardSize)]){
        mobility |= element.direction;
      }
    }
  );
  return mobility;
}

export default checkMobility;