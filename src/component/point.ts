//盤上座標
export default class Point{
  x: number;
  y: number;
}

export const addPoints = (firstPoint:Point, secondPoint:Point):Point =>{
  return {
    x: firstPoint.x + secondPoint.x,
    y: firstPoint.y + secondPoint.y
  }
}

export const getPointByIndex = (idx:number, boardSize:number):Point=>{
  return {
    x: idx%boardSize,
    y: Math.floor(idx/boardSize)
  }
}

export const getIndexByPoint = (point:Point, boardSize:number):number =>{
  return point.x + point.y*boardSize;
}

export const isInBoard = (point: Point,boardSize:number): boolean =>{
  return(point.x  >=0 && point.x < boardSize
    &&  point.y  >=0 && point.y < boardSize);
}