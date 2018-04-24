import * as React from 'react';

interface ScoreBoardInterface{
  blackNum: number;
  whiteNum: number;
}

const scoreBoard = (props: ScoreBoardInterface):JSX.Element=>{
  return <div className="scoreBoard">
          <div>Black:{props.blackNum}</div>
          <div>White:{props.whiteNum}</div>
         </div>
}

export default scoreBoard;