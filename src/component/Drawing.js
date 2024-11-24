import React, { useRef, useEffect, memo } from 'react';

function Drawing({ strokes, isDrawing, addStroke, addStrokePos, endStroke, canvasRef }) {
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      strokes.forEach((stroke) => {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        stroke.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });
    }
  }, [strokes]);

  const computeMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  return (
    <canvas
      className="canvas shadow-lg" // CSS sınıfını burada kullanın
      ref={canvasRef}
      onPointerDown={(e) => addStroke(computeMousePos(e))}
      onPointerMove={(e) => isDrawing && addStrokePos(computeMousePos(e))}
      onPointerUp={endStroke}
      onPointerLeave={endStroke}
      width="280"
      height="280"
    />
  );
};

export default memo(Drawing);