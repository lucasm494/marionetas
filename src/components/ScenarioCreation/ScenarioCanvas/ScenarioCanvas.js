import { useState } from 'react';
import './ScenarioCanvas.css';

function ScenarioCanvas({ items, selectedItem, onItemDrop, onItemSelect, onItemUpdate }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      const item = JSON.parse(itemData);
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - (dragOffset.x || 0),
        y: e.clientY - rect.top - (dragOffset.y || 0)
      };
      onItemDrop({ ...item, position });
    }
  };

  const handleItemDragStart = (e, item) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onItemSelect(item);
  };

  const handleItemDrag = (e, item) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left - dragOffset.x,
      y: e.clientY - rect.top - dragOffset.y
    };
    
    // Update position in real-time while dragging
    onItemUpdate(item.id, { position: newPosition });
  };

  const handleItemDragEnd = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e) => {
    // Deselect if clicking on empty canvas
    if (e.target === e.currentTarget) {
      onItemSelect(null);
    }
  };

  return (
    <div 
      className="scenario-canvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {/* Background Grid */}
      <div className="canvas-grid"></div>
      
      {/* Placed Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`scenario-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
          style={{
            left: item.position.x,
            top: item.position.y,
            transform: `rotate(${item.rotation || 0}deg) scale(${item.scale || 1})`,
            zIndex: item.zIndex
          }}
          draggable
          onDragStart={(e) => handleItemDragStart(e, item)}
          onDrag={(e) => handleItemDrag(e, item)}
          onDragEnd={handleItemDragEnd}
          onClick={(e) => {
            e.stopPropagation();
            onItemSelect(item);
          }}
        >
          <div className="item-content">
            {item.name}
          </div>
          
          {/* Selection Handles */}
          {selectedItem?.id === item.id && (
            <div className="selection-handles">
              <div className="handle handle-top-left"></div>
              <div className="handle handle-top-right"></div>
              <div className="handle handle-bottom-left"></div>
              <div className="handle handle-bottom-right"></div>
            </div>
          )}
        </div>
      ))}
      
      {/* Drop Zone Highlight */}
      <div className="drop-zone-overlay">
        Drop items here to add to scenario
      </div>
    </div>
  );
}

export default ScenarioCanvas;