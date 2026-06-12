"use client";

import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    // Importar qrcode dinamicamente (client-side only)
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current!, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#3D3530",
          light: "#FAFAF7",
        },
        errorCorrectionLevel: "M",
      });
    });
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-2xl"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
