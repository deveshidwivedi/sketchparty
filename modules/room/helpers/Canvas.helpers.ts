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
    movesWithoutUser: Move[],
    savedMoves: Move[],
    users: {[key: string]: Move[]}
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    movesWithoutUser.forEach((move)=>{
      handleMove(move,ctx);
    });
    
    Object.values(users).forEach((user)=>{
      user.forEach((move)=> handleMove(move,ctx));
    });

    savedMoves.forEach((move)=> {
      handleMove(move,ctx);
    });


  };
  