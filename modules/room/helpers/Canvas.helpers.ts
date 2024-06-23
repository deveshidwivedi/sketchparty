export const handleMove = (
    move: Move,
    ctx: CanvasRenderingContext2D,
  )=>{
    const {options, path} = move;
    const tempCtx = ctx;

    if(tempCtx){
      tempCtx.lineWidth= options.lineWidth;
      tempCtx.strokeStyle= options.lineColor;

      tempCtx.beginPath();
      path.forEach(([x,y])=>{
        tempCtx.lineTo(x,y);
      });
      tempCtx.stroke();
      tempCtx.closePath();
    }
  };

  export const drawAllMoves = (
    ctx: CanvasRenderingContext2D,
    room: ClientRoom
  ) => {
    const {usersMoves, movesWithoutUser, myMoves} = room;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    movesWithoutUser.forEach((move)=>{
      handleMove(move,ctx);
    });
    
    usersMoves.forEach((userMoves)=>{
      userMoves.forEach((move)=> handleMove(move,ctx));
    });

    myMoves.forEach((move)=> {
      handleMove(move,ctx);
    });


  };
  