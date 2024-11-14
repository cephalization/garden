function resizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  bounds: { width: number; height: number },
) {
  const scale = window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  ctx.scale(scale, scale);
  bounds.width = canvas.width / scale;
  bounds.height = canvas.height / scale;
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) {
    throw new Error("Canvas context not found");
  }

  const bounds = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  ctx.imageSmoothingEnabled = false;

  resizeCanvas(canvas, ctx, bounds);
  window.addEventListener("resize", () => {
    resizeCanvas(canvas, ctx, bounds);
  });

  function update() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { update, ctx, canvas, bounds };
}

export type CanvasSetup = ReturnType<typeof setupCanvas>;
