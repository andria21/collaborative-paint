export default function erase(prevPoint, currentPoint, ctx, canvas) {
  if (!ctx || !prevPoint || !currentPoint) return;
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(prevPoint.x, prevPoint.y);
  ctx.lineTo(currentPoint.x, currentPoint.y);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

// export default function erase(prevPoint, currentPoint, ctx, canvas) {
//   if (!ctx || !prevPoint || !currentPoint) return;
//   ctx.globalCompositeOperation = "source-over"; // Set the blending mode to draw
//   ctx.lineWidth = 10;
//   ctx.strokeStyle = "white"; // Set the color to white
//   ctx.beginPath();
//   ctx.moveTo(prevPoint.x, prevPoint.y);
//   ctx.lineTo(currentPoint.x, currentPoint.y);
//   ctx.stroke();
// }
