export default function erase(startPoint, endPoint, ctx) {
  if (!ctx || !startPoint || !endPoint) return;
  ctx.globalCompositeOperation = "destination-out"; // This mode erases pixels
  ctx.lineWidth = 10; // Adjust the eraser size as needed
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over"; // Reset to the default drawing mode
}
