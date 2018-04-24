import * as React from 'react';
import Board from "./board";
import { SquareState,  Color, SquareType, squareInitialState, getOppositeColor} from "./square";
import checkMobility,{Disc, directionVector} from "./checkMobility";
import Point,{ addPoints, getPointByIndex, getIndexByPoint, isInBoard} from "./point";
import ScoreBoard from "./scoreBoard"
import direction from "./direction";
import ColorStorage from "./colorStorage";

interface GameState {
  history: {
    squares: SquareState[],
    movableDir: number[], //各座標で打てるか
    movablePos: Disc[], //打てる座標
    nextColor: Color,
  }[],
  curStep: number,
  boardSize: number,
}

const initialBoardSize: number = 8;



export default class Game extends React.Component<{}, GameState>{
  private colorStorage:ColorStorage;

  constructor() {
    super();
    const initialState: SquareState[] = squareInitialState(initialBoardSize);
    const initialColor: Color = Color.BLACK;
    this.colorStorage= new ColorStorage(initialState);
    const nextMovableDir = this.initMovableDir(initialState,initialColor,initialBoardSize);
    const nextMovablePos = this.initMovablePos(nextMovableDir,initialColor,initialBoardSize);
    
    this.state = {
      history: [{
        squares: initialState,
        movableDir: nextMovableDir,
        movablePos: nextMovablePos,
        nextColor: initialColor,
      }],
      curStep: 0,
      boardSize: initialBoardSize,
    }
  }


  handleClick(idx: number){
    if(this.isGameOver()){
      return;
    }
    const point:Point = getPointByIndex(idx,this.state.boardSize);
    this.move(point);
  }

  //盤面が埋まる最大の手番
  maxTurn(): number{
    return this.state.boardSize*this.state.boardSize -4;
  }

  //続行可能かを返す
  isGameOver(){
    //盤面が埋まっているなら終了
    if(this.state.curStep >= this.maxTurn()){
      console.log("test");
      return true;
    }
    const history = this.state.history;
    const current = history[this.state.curStep];
    const movablePos = current.movablePos.slice();
    
    //打てる手があるならまだ終わらない
    if(movablePos.length > 0){
      return false;
    }

    const oppositeColor = getOppositeColor(current.nextColor);

    //現在の手番と逆の色で打てるか調べる
    const square = current.squares.slice();
    return square.map((value,idx) =>{return (value ==SquareType.EMPTY) ? idx : -1} )
          .filter((x)=>x >=0)
          .some((elem) =>{return checkMobility({
              point: getPointByIndex(elem, this.state.boardSize),
              color: oppositeColor
            },
            square,
            this.state.boardSize
          ) !== direction.NONE});
  }

  move(point: Point):boolean{
    const index = getIndexByPoint(point, this.state.boardSize);

    if(!isInBoard(point, this.state.boardSize)){
      return false;
    }

    const history = this.state.history.slice(0, this.state.curStep +1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    const movableDir = current.movableDir.slice();
    if(movableDir[index] === direction.NONE ||squares[index] !== SquareType.EMPTY){
      return false;
    }

    const disc:Disc= {
      point: point,
      color: current.nextColor,
    }

    const flipResult = this.flipDiscs(disc, movableDir[index], squares);

    const nextSquares: SquareState[] = flipResult.squares;
    this.colorStorage.changeColorNum(flipResult.diffNum, current.nextColor)

    let nextColor:Color = getOppositeColor(current.nextColor);
    //打てる手の更新
    let nextMovableDir=this.initMovableDir(squares,nextColor,this.state.boardSize);
    let nextMovablePos=this.initMovablePos(nextMovableDir,nextColor,this.state.boardSize);
    //次に打てる手がないならパス
    if(nextMovablePos.length === 0){
      nextColor = getOppositeColor(nextColor);
      nextMovableDir=this.initMovableDir(squares,nextColor,this.state.boardSize);
      nextMovablePos=this.initMovablePos(nextMovableDir,nextColor,this.state.boardSize);
    }

    this.setState({
      history: history.concat([{
        squares: nextSquares,
        movableDir: nextMovableDir,
        movablePos: nextMovablePos,
        nextColor: nextColor
      }]),
      curStep: history.length})

    return true;
  }

  //石を置き、ひっくり返した盤面を返す。
  flipDiscs(disc: Disc, dir:number, squares: SquareState[]){
    let diffNum:number=1;

    squares[getIndexByPoint(disc.point, this.state.boardSize)]= disc.color;
    directionVector.forEach((elem)=>{
      if(dir & elem.direction){
        let nextPoint:Point = addPoints(disc.point, elem.vector);
        while(squares[getIndexByPoint(nextPoint,this.state.boardSize)] !== disc.color){
          squares[getIndexByPoint(nextPoint,this.state.boardSize)] = disc.color;
          nextPoint= addPoints(nextPoint, elem.vector);
          ++diffNum;
        }
      }
    })
    return {squares, diffNum};
  }

  initMovableDir(square: SquareState[],nextColor: Color, boardSize:number):number[]{
    return square.map((elem,idx)=>{return checkMobility({
      point: getPointByIndex(idx,boardSize),
      color: nextColor
    },square,boardSize)
   })
  }

  initMovablePos(movableDir:number[],nextColor: Color,boardSize:number):Disc[]{
    return movableDir.map((elem,idx)=>{
        return (elem !== direction.NONE) ? idx : -1;
      }).filter((x)=>x >=0).map((elem)=>{return (
        {
          point: getPointByIndex(elem, boardSize),
          color: nextColor
        })
      })
  }

  //ターンの巻き戻し
  jumpTo(step:number){
    this.setState({
      curStep: step
    })
    const history = this.state.history;
    const current = history[this.state.curStep];
    const squares = current.squares.slice();
    this.colorStorage=new ColorStorage(squares);
  }

  
  //各石の数と勝敗を表示
  curState(curSquares:SquareState[]){
    const blackNum:number = curSquares.filter((elem)=>elem === Color.BLACK).length;
    const whiteNum:number = curSquares.filter((elem)=>elem === Color.WHITE).length;
    

    if(this.isGameOver()){
      console.log("game over");
      const gameStatus = (blackNum > whiteNum) ? <div>Winner: Black</div>
                          :(whiteNum > blackNum) ? <div>Winner: White</div>: <div>Draw</div>;
      return <div>
              <ScoreBoard whiteNum={whiteNum} blackNum={blackNum}/>
              {gameStatus}
             </div>;
    }
    else{
      return <div>
              <ScoreBoard whiteNum={whiteNum} blackNum={blackNum}/>
             </div>;
    }
  }

  render(){
    const history = this.state.history;
    const current = history[this.state.curStep];

    const moves = history.map((step, move)=>{
      const desc = move ?
        'Move #' + move:
        'GameStart';
      return (
        <li key={move}>
          <a href = "#" onClick = {()=> this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })

    return(
      <div className="game">
        <div>
          Current Step: {this.state.curStep}
          NextColor: {current.nextColor}
        </div>
        {this.curState(current.squares.slice())}
        <div className="game-board">
          <Board 
            rawBoard = {current.squares}
            movableStates = {current.movableDir.map((elem)=>{return elem !== direction.NONE})}
            boardSize = {this.state.boardSize}
            onClick = {(i) =>this.handleClick(i)}
          />
        </div>
        <div className = "game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}