export const drawFromSocket = (
    socketMoves: [number, number][],
    socketOptions: CtxOptions,
    ctx: CanvasRenderingContext2D,
    afterDraw: ()=> void
  )=>{
    const tempCtx = ctx;

    if(tempCtx){
      tempCtx.lineWidth= socketOptions.lineWidth;
      tempCtx.strokeStyle= socketOptions.lineColor;

      tempCtx.beginPath();
      socketMoves.forEach(([x,y])=>{
        tempCtx.lineTo(x,y);
      });
      tempCtx.stroke();
      tempCtx.closePath();
      afterDraw();
    }
  };

  export const drawOnUndo = (
    ctx: CanvasRenderingContext2D,
    savedMoves: [number, number][][],
    users: {[key:string]: [number, number][][]}
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    Object.values(users).forEach((user)=>{
      user.forEach((userMove)=>{
        ctx.beginPath();
        userMove.forEach(([x,y])=>{
          ctx.lineTo(x,y);
        });
        ctx.stroke();
        ctx.closePath();
      });
    });

    savedMoves.forEach((movesArr)=> {
      ctx.beginPath();
      movesArr.forEach(([x,y])=>{
        ctx.lineTo(x,y);
      });
      ctx.stroke();
      ctx.closePath();  
    });


  };
  