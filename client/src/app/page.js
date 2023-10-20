"use client";

import { useDraw } from "@/hooks/useDraw";
import drawLine from "@/utils/drawLine";
import erase from "@/utils/erase";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "react-pick-color";
import { io } from "socket.io-client";

const socket = io("https://collaborative-paint-server.vercel.app/");

console.log(socket);

export default function Home() {
  const canvasRef = useRef(null);

  const [color, setColor] = useState("#000");
  const [isErasing, setIsErasing] = useState(false);

  const { onMouseDown, setCanvasRef, clearCanvas } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current?.toDataURL());
    });

    socket.on("canvas-state-from-server", (state) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", (data) => {
      if (!ctx) return;
      drawLine(data.prevPoint, data.currentPoint, ctx, data.color, 5);
    });

    socket.on("clear", clearCanvas);

    socket.on("erase", (eraseData) => {
      if (!isErasing) return;
    
      const ctx = canvasRef.current?.getContext("2d");
      erase(eraseData.prevPoint, eraseData.currentPoint, ctx);
    });

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef, isErasing]);

  function createLine(ctx, currentPoint, prevPoint) {
    if (isErasing) {
      const eraseData = { prevPoint, currentPoint };
      socket.emit("erase", eraseData);
      erase(prevPoint, currentPoint, ctx);
    } else {
      const data = { prevPoint, currentPoint, color };
      socket.emit("draw-line", data);
      if (ctx) {
        drawLine(prevPoint, currentPoint, ctx, color, 5);
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ColorPicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black"
          onClick={() => {
            socket.emit("clear");
          }}
        >
          Clear canvas
        </button>
        <button
          type="button"
          className={`p-2 rounded-md border ${
            isErasing ? "bg-gray-300" : "border-black"
          }`}
          onClick={() => {
            setIsErasing(!isErasing);
          }}
        >
          {isErasing ? "Drawing" : "Erasing"}
        </button>
      </div>
      <canvas
        width={750}
        height={750}
        className="border border-black rounded-md"
        ref={(ref) => {
          setCanvasRef(ref);
          canvasRef.current = ref;
        }}
        onMouseDown={onMouseDown}
      />
    </div>
  );
}
