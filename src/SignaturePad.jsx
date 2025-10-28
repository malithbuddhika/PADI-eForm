import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

// A lightweight signature pad using pointer events. Supports fullScreen mode (canvas sized to window),
// smoothing via quadratic curves, drawing dots (tap), clear, and emits dataURL on change.
const SignaturePad = forwardRef(function SignaturePad({ 
  onChange, 
  initialData, 
  fullScreen = false, 
  strokeWidth = 3 
}, ref) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const lastMid = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const pendingEmit = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ratio = Math.min(window.devicePixelRatio || 1, 2); // Limit ratio for performance
    const parent = canvas.parentElement;
    
    if (fullScreen) {
      // Use visual viewport for mobile devices to account for keyboard
      const visualViewport = window.visualViewport;
      const width = visualViewport ? visualViewport.width : window.innerWidth;
      const height = visualViewport ? visualViewport.height : window.innerHeight;
      
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    } else {
      // Use parent container dimensions
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    
    const ctx = canvas.getContext('2d');
    if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#111827';
    ctx.fillStyle = '#111827';
    ctxRef.current = ctx;
  };

  useEffect(() => {
    setupCanvas();
    
    const handleResize = () => {
      setupCanvas();
      // Redraw initial data if exists after resize
      if (initialData) {
        loadInitialData();
      }
    };
    
    // Use visual viewport resize for mobile devices
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [fullScreen]);

  const loadInitialData = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !initialData) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cssW = canvas.width / (window.devicePixelRatio || 1);
      const cssH = canvas.height / (window.devicePixelRatio || 1);
      ctx.drawImage(img, 0, 0, cssW, cssH);
    };
    img.onerror = () => {
      console.warn('Failed to load initial signature image');
    };
    img.crossOrigin = 'anonymous';
    img.src = initialData;
  };

  // Load initial data after canvas is set up
  useEffect(() => {
    if (ctxRef.current) {
      loadInitialData();
    }
  }, [initialData]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    // Return coordinates in CSS pixels (canvas scaled to devicePixelRatio)
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: e.pressure || (e.touches ? 0.5 : 1)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set pointer capture for better touch handling
    try {
      if (canvas.setPointerCapture && e.pointerId) {
        canvas.setPointerCapture(e.pointerId);
      }
    } catch (err) {
      // Ignore if not supported
    }
    
    drawingRef.current = true;
    movedRef.current = false;
    setIsDrawing(true);
    
    const p = getPos(e);
    lastPoint.current = p;
    lastMid.current = p;
    
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e) => {
    if (!drawingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const p = getPos(e);
    const ctx = ctxRef.current;
    
    // Apply pressure sensitivity if available
    const lineWidth = strokeWidth * (e.pressure || 1);
    ctx.lineWidth = Math.max(1, lineWidth);
    
    const midX = (lastPoint.current.x + p.x) / 2;
    const midY = (lastPoint.current.y + p.y) / 2;
    // Draw smoothed quadratic curve but ensure immediate visibility
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, p.x, p.y);
    ctx.stroke();
    
    lastPoint.current = p;
    lastMid.current = { x: midX, y: midY };
    movedRef.current = true;
    
    // Throttle data URL generation
    if (!pendingEmit.current) {
      pendingEmit.current = true;
      requestAnimationFrame(() => {
        pendingEmit.current = false;
        if (onChange && canvasRef.current) {
          try {
            onChange(canvasRef.current.toDataURL('image/png'));
          } catch (e) {
            console.warn('Failed to generate signature data URL:', e);
          }
        }
      });
    }
  };

  const stopDrawing = (e) => {
    if (!drawingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    drawingRef.current = false;
    setIsDrawing(false);
    
    const ctx = ctxRef.current;
    
    // Draw a dot if user just tapped without moving
    if (!movedRef.current) {
      const p = lastPoint.current;
      const r = Math.max(1, strokeWidth / 2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Final emit
    if (onChange && canvasRef.current) {
      try {
        onChange(canvasRef.current.toDataURL('image/png'));
      } catch (e) {
        console.warn('Failed to generate signature data URL:', e);
      }
    }
  };

  // Event handlers setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent default touch behaviors
    const preventDefault = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    // Pointer events (modern approach)
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

  // Only pointer events to avoid duplicate touch+pointer events

    // Prevent context menu on long press
    canvas.addEventListener('contextmenu', preventDefault);

    // Style for better touch experience
    canvas.style.touchAction = 'none';
    canvas.style.msTouchAction = 'none';
    canvas.style.webkitTouchCallout = 'none';
    canvas.style.userSelect = 'none';
    canvas.style.webkitUserSelect = 'none';
    canvas.style.cursor = 'crosshair';

    return () => {
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointercancel', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
      canvas.removeEventListener('contextmenu', preventDefault);
    };
  }, [onChange, strokeWidth]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onChange) onChange('');
  };

  // expose imperative methods
  useImperativeHandle(ref, () => ({
    clear: () => {
      clear();
    },
    getDataURL: () => (canvasRef.current ? canvasRef.current.toDataURL('image/png') : '')
  }));
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50 bg-white' : 'w-full h-full'}`}>
      <div className={`${fullScreen ? 'w-full h-full' : 'w-full h-full bg-white'}`}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block touch-none select-none"
        />
      </div>
    </div>
  );
});

export default SignaturePad;