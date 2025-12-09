
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
    const container = containerRef.current;
    if (!container) return;
    const { x, y } = touchOffsetRef.current;
    container.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
  };

  const scheduleTransform = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const { x, y } = touchOffsetRef.current;
      container.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
    });
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
    
    // Store this item's unique touch ID
    let myTouchId = null;

    const endTouchDrag = () => {
      setTouchDragging(false);
      touchOffsetRef.current = { x: 0, y: 0 };
      scheduleTransform();
      myTouchId = null;
      dragStateRef.current = { rect: null, rotation: 0 };
    };

    const handleTouchStart = (e) => {
      // Skip if in painting mode or already dragging
      if (item.color && selectedColor) return;
      if (myTouchId !== null) return; // Already dragging
      if (!e.touches || e.touches.length === 0) return;
      
      // Find the touch that is actually on this element
      const containerRect = container.getBoundingClientRect();
      let touchOnThisElement = null;
      
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        if (t.clientX >= containerRect.left && t.clientX <= containerRect.right &&
            t.clientY >= containerRect.top && t.clientY <= containerRect.bottom) {
          touchOnThisElement = t;
          break;
        }
      }
      
      if (!touchOnThisElement) return;
      
      e.stopPropagation(); // Prevent this touch from affecting other items
      
      myTouchId = touchOnThisElement.identifier;
      
			const rect = container.getBoundingClientRect();
			const rotation = getRotation();
			dragStateRef.current = { rect, rotation };
      touchStartRef.current = toLocalPoint(touchOnThisElement.clientX, touchOnThisElement.clientY, dragStateRef.current);
      setTouchDragging(true);
      touchOffsetRef.current = { x: 0, y: 0 };
      scheduleTransform();
    };

    const handleTouchMove = (e) => {
      if (myTouchId === null) return;
      const touch = findTouchById(e.touches, myTouchId);
      if (!touch) return;
      
      // Only prevent default and handle move for THIS item's touch
      e.preventDefault();
      e.stopPropagation();
      
      const { x, y } = toLocalPoint(touch.clientX, touch.clientY, dragStateRef.current);
      touchOffsetRef.current = {
        x: x - touchStartRef.current.x,
        y: y - touchStartRef.current.y
      };
      scheduleTransform();
    };

    const handleTouchEnd = (e) => {
      if (myTouchId === null) return;
      const touch = findTouchById(e.changedTouches, myTouchId);
      if (!touch) return;

      e.stopPropagation();

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

    const handleTouchCancel = (e) => {
      if (myTouchId === null) return;
      const touch = findTouchById(e.changedTouches, myTouchId);
      if (!touch) return;
      
      e.stopPropagation();
      endTouchDrag();
    };

    // Attach touchstart to container, move/end/cancel to window for proper multi-touch support
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
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
