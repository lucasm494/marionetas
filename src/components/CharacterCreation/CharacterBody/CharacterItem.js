
import { useRef, useEffect, useState } from 'react';
import interact from 'interactjs';
import './CharacterItem.css';

function CharacterItem({ item, isSelected, onSelect, onUpdate, panelId, selectedColor }) {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [painting, setPainting] = useState(false);
  const [size, setSize] = useState({ width: 120, height: 120 });
  const interactInstanceRef = useRef(null);

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

    // Detect rotation from parent panel
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

    // Initialize Interact.js draggable for painting
    let isPainting = false;
    
    const interactInstance = interact(canvas)
      .draggable({
        listeners: {
          start(event) {
            event.preventDefault();
            isPainting = true;
            setPainting(true);
            const rect = canvas.getBoundingClientRect();
            const rotation = getRotation();
            let x, y;
            
            if (rotation === 90 || rotation === -270) {
              // Rotated 90 degrees clockwise
              x = event.clientY - rect.top;
              y = rect.width - (event.clientX - rect.left);
            } else if (rotation === -90 || rotation === 270) {
              // Rotated 90 degrees counter-clockwise
              x = rect.height - (event.clientY - rect.top);
              y = event.clientX - rect.left;
            } else {
              // No rotation
              x = event.clientX - rect.left;
              y = event.clientY - rect.top;
            }
            
            paint(x, y);
          },
          move(event) {
            if (!isPainting) return;
            const rect = canvas.getBoundingClientRect();
            const rotation = getRotation();
            let x, y;
            
            if (rotation === 90 || rotation === -270) {
              x = event.clientY - rect.top;
              y = rect.width - (event.clientX - rect.left);
            } else if (rotation === -90 || rotation === 270) {
              x = rect.height - (event.clientY - rect.top);
              y = event.clientX - rect.left;
            } else {
              x = event.clientX - rect.left;
              y = event.clientY - rect.top;
            }
            
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
        transform: 'translate(-50%, -50%)',
        
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
