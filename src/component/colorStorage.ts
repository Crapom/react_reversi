import {Color, SquareState} from "./square";


export default class ColorStorage{
  constructor(initialState:SquareState[]){
    this.blackNum=0;
    this.whiteNum=0;
    this.emptyNum=0;

    initialState.forEach(
      (elem)=>{
        switch(elem){
          case Color.BLACK:
            ++this.blackNum;
            break;
          case Color.WHITE:
            ++this.whiteNum;
            break;
          default:
            ++this.emptyNum;
            break;
        }
      }
    )
    return;
  }
  private blackNum:number;
  private whiteNum:number;
  private emptyNum:number;

  changeColorNum(amount:number,addedColor:Color){
    switch(addedColor){
      case Color.BLACK:
        this.blackNum += amount;
        this.whiteNum -= amount-1;
        break;
      default:
        this.whiteNum += amount;
        this.blackNum -= amount-1;
      break;
    }
    --this.emptyNum;
  }

}