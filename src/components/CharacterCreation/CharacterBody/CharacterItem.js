
import { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import './CharacterItem.css';

function CharacterItem({ item, isSelected, onSelect, onUpdate, panelId, selectedColor, onTrashDrop }) {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [painting, setPainting] = useState(false);
  const [size, setSize] = useState({ width: 120, height: 120 });
  const interactInstanceRef = useRef(null);
	const activeTouchIdRef = useRef(null);
	const touchStartRef = useRef({ x: 0, y: 0 });
  const touchOffsetRef = useRef({ x: 0, y: 0 });
  const [touchDragging, setTouchDragging] = useState(false);
  const rafRef = useRef(null);
	const dragStateRef = useRef({ rect: null, rotation: 0 });

  // Read rotation from any parent transform (same logic used for painting)
  const getRotation = () => {
    let element = containerRef.current;
    while (element) {
      const style = window.getComputedStyle(element);
      const transform = style.transform;
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (match) {
          const values = match[1].split(',').map(parseFloat);
          const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
          if (angle !== 0) return angle;
        }
      }
      element = element.parentElement;
    }
    return 0;
  };

  const toLocalPoint = (clientX, clientY, state) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = state?.rect || container.getBoundingClientRect();
    const rotation = state?.rotation ?? getRotation();
    if (rotation === 90 || rotation === -270) {
      return {
        x: clientY - rect.top,
        y: rect.width - (clientX - rect.left)
      };
    } else if (rotation === -90 || rotation === 270) {
      return {
        x: rect.height - (clientY - rect.top),
        y: clientX - rect.left
      };
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const applyTransform = () => {
    if (!containerRef.current) return;
    const { x, y } = touchOffsetRef.current;
    containerRef.current.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
  };

  const scheduleTransform = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyTransform);
  };

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = item.width;
    canvas.height = item.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (item.paintedImage) {
        const paintedImg = new window.Image();
        paintedImg.onload = () => ctx.drawImage(paintedImg, 0, 0, canvas.width, canvas.height);
        paintedImg.src = item.paintedImage;
      }
    };
    img.src = item.image;
  }, [item.image, item.paintedImage, item.width , item.height]);

  const paint = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = item.color;
    ctx.beginPath();
    const brushSize = Math.max(canvas.width, canvas.height) * 0.08;
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  // --- Touch drag to trash support (mobile) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const findTouchById = (touchList, id) => Array.from(touchList || []).find((t) => t.identifier === id);
    
    // Create handler refs to maintain stable references across re-renders
    const handlersRef = { move: null, end: null };

    const endTouchDrag = () => {
      setTouchDragging(false);
      touchOffsetRef.current = { x: 0, y: 0 };
      scheduleTransform();
      activeTouchIdRef.current = null;
      dragStateRef.current = { rect: null, rotation: 0 };
      if (handlersRef.move) {
        window.removeEventListener('touchmove', handlersRef.move, { passive: false });
        handlersRef.move = null;
      }
      if (handlersRef.end) {
        window.removeEventListener('touchend', handlersRef.end, { passive: false });
        handlersRef.end = null;
      }
    };

    const handleTouchStart = (e) => {
      // Skip if in painting mode
      if (item.color && selectedColor) return;
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const touchId = touch.identifier;
      activeTouchIdRef.current = touchId;
			const rect = container.getBoundingClientRect();
			const rotation = getRotation();
			dragStateRef.current = { rect, rotation };
      touchStartRef.current = toLocalPoint(touch.clientX, touch.clientY, dragStateRef.current);
      setTouchDragging(true);
      touchOffsetRef.current = { x: 0, y: 0 };
      scheduleTransform();

      // Create move handler specific to this drag instance
      const handleTouchMove = (e) => {
        if (activeTouchIdRef.current !== touchId) return;
        const touch = findTouchById(e.touches, touchId);
        if (!touch) return;
        e.preventDefault();
        const { x, y } = toLocalPoint(touch.clientX, touch.clientY, dragStateRef.current);
        touchOffsetRef.current = {
          x: x - touchStartRef.current.x,
          y: y - touchStartRef.current.y
        };
        scheduleTransform();
      };

      // Create end handler specific to this drag instance
      const handleTouchEnd = (e) => {
        if (activeTouchIdRef.current !== touchId) return;
        const touch = findTouchById(e.changedTouches, touchId);
        if (!touch) return;

        const trashEl = document.querySelector(`.trash-button[data-panel-id="${panelId}"]`);
        if (trashEl) {
          const rect = trashEl.getBoundingClientRect();
          const inside = touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom;
          if (inside && onTrashDrop) {
            onTrashDrop(item);
          }
        }

        endTouchDrag();
      };

      handlersRef.move = handleTouchMove;
      handlersRef.end = handleTouchEnd;
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart, { passive: false });
      if (handlersRef.move) {
        window.removeEventListener('touchmove', handlersRef.move, { passive: false });
      }
      if (handlersRef.end) {
        window.removeEventListener('touchend', handlersRef.end, { passive: false });
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [item, panelId, selectedColor, onTrashDrop]);

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onUpdate({ ...item, paintedImage: canvas.toDataURL('image/png') });
  };

  // Setup Interact.js for painting when item has color AND color is selected
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !item.color || !selectedColor) {
      // Cleanup if no color or no color selected
      if (interactInstanceRef.current) {
        interactInstanceRef.current.unset();
        interactInstanceRef.current = null;
      }
      return;
    }

    // Initialize Interact.js draggable for painting
    let isPainting = false;
    
    const interactInstance = interact(canvas)
      .draggable({
        listeners: {
          start(event) {
            event.preventDefault();
            isPainting = true;
            setPainting(true);
            const { x, y } = toLocalPoint(event.clientX, event.clientY);
            paint(x, y);
          },
          move(event) {
            if (!isPainting) return;
            const { x, y } = toLocalPoint(event.clientX, event.clientY);
            paint(x, y);
          },
          end() {
            isPainting = false;
            setPainting(false);
            save();
          }
        }
      })
      .styleCursor(false);

    interactInstanceRef.current = interactInstance;

    return () => {
      if (interactInstanceRef.current) {
        interactInstanceRef.current.unset();
        interactInstanceRef.current = null;
      }
    };
  }, [item.color, selectedColor]);

  return (
    <div
      ref={containerRef}
      className={`character-item${isSelected ? ' selected' : ''}${item.color && selectedColor ? ' has-color' : ''}`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        transform: 'translate(-50%, -50%)', // live transform applied imperatively for performance
      }}
      onClick={e => { 
        console.log(`🖱️ [${panelId || 'CharacterItem'}] Item clicked:`, item.name);
        e.stopPropagation(); 
        onSelect(item); 
      }}
      draggable={!item.color || !selectedColor}
      onDragStart={e => {
        if (item.color && selectedColor) return e.preventDefault();
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        e.dataTransfer.effectAllowed = 'move';
        console.log(`👆 [${panelId || 'CharacterItem'}] Drag started for:`, item.name);
      }}
      data-panel-id={panelId}
    >
      <canvas
        ref={canvasRef}
        className="item-canvas"
        style={{ 
          cursor: item.color && selectedColor ? 'crosshair' : 'default', 
          display: 'block',
          touchAction: item.color && selectedColor ? 'none' : 'auto'
        }}
      />
    </div>
  );
}

export default CharacterItem;
