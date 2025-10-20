import { useRef, useEffect } from 'react';

export default function SignaturePad({ onChange, initialData }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctxRef.current = ctx;
  }, []);

  // load initial signature image if provided
  useEffect(() => {
    if (!initialData) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw image scaled to canvas size
      ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
      if (onChange) onChange(canvas.toDataURL('image/png'));
    };
    img.crossOrigin = 'anonymous';
    img.src = initialData;
  }, [initialData]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    const p = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(p.x, p.y);
    e.preventDefault();
  };

  const move = (e) => {
    if (!drawing.current) return;
    const p = getPos(e);
    ctxRef.current.lineTo(p.x, p.y);
    ctxRef.current.stroke();
    e.preventDefault();
    if (onChange) onChange(canvasRef.current.toDataURL('image/png'));
  };

  const end = (e) => {
    drawing.current = false;
    if (onChange) onChange(canvasRef.current.toDataURL('image/png'));
    e.preventDefault();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onChange) onChange('');
  };

  return (
    <div>
      <div className="border rounded" style={{ height: 180 }}>
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          style={{ width: '100%', height: '100%', touchAction: 'none' }}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button type="button" onClick={clear} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
      </div>
    </div>
  );
}
