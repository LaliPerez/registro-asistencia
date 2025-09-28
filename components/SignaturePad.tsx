
import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string | null;
  isEmpty: boolean;
}

interface SignaturePadProps {
  width?: number;
  height?: number;
}

const SignaturePad = React.forwardRef<SignaturePadRef, SignaturePadProps>(({ width = 400, height = 200 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const clearCanvas = () => {
    const context = getCanvasContext();
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setIsEmpty(true);
    }
  };

  const getSignatureDataURL = () => {
    if (isEmpty || !canvasRef.current) return null;
    return canvasRef.current.toDataURL('image/png');
  };

  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
    getSignature: getSignatureDataURL,
    get isEmpty() {
      return isEmpty;
    }
  }));

  const getCoords = (event: MouseEvent | TouchEvent): { x: number, y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    if (event.touches.length > 0) {
      return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
    }
    return null;
  };
  
  const startDrawing = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const coords = getCoords(event);
    if (!coords) return;
    const context = getCanvasContext();
    if (!context) return;
    
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setIsEmpty(false);
  };
  
  const draw = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    event.preventDefault();
    const coords = getCoords(event);
    if (!coords) return;
    const context = getCanvasContext();
    if (!context) return;

    context.lineTo(coords.x, coords.y);
    context.stroke();
  };
  
  const stopDrawing = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    const context = getCanvasContext();
    if (!context) return;

    context.closePath();
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions based on its container for responsiveness
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if(canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  return (
    <div className="relative w-full h-48 bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 cursor-crosshair overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      {isEmpty && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 pointer-events-none">
          Firme aquí
        </div>
      )}
    </div>
  );
});

export default SignaturePad;
