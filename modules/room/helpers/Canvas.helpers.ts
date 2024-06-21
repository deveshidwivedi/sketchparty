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

  export const drawOnUndo = (
    ctx: CanvasRenderingContext2D,
    savedMoves: Move[],
    users: {[key: string]: Move[]}
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    Object.values(users).forEach((user)=>{
      user.forEach((move)=> handleMove(move,ctx));
    });

    savedMoves.forEach((move)=> {
      handleMove(move,ctx);
    });


  };
  