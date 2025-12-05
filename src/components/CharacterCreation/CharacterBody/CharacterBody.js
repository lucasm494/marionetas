import './CharacterBody.css';
import CharacterItem from './CharacterItem';
import { useEffect } from 'react';
import characterSilhouette from '../../../assets/corpo.svg';
import { getPositionForItemType } from '../../../config/itemPositions'; // ← Importa

function CharacterBody({ characterItems, onItemDrop, onItemSelect, selectedItem, onItemUpdate, panelId }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    
    if (itemData) {
      try {
        const item = JSON.parse(itemData);
        
        if (!item.type) {
          console.error(`❌ [${panelId}] Item missing type property:`, item);
          return;
        }
        
        // USA A FUNÇÃO DO CONFIG
        const position = getPositionForItemType(item.type);
        console.log(`📍 [${panelId}] Position from config:`, position, 'for type:', item.type);
        
        onItemDrop({ ...item, position });
        
      } catch (error) {
        console.error(`❌ [${panelId}] Error parsing dropped item:`, error);
      }
    }
  };

  // Handler para drops do Carousel
  useEffect(() => {
    const handleCarouselDrop = (e) => {
      if (!e.detail.type) {
        console.error(`❌ [${panelId}] Carousel drop item missing type:`, e.detail);
        return;
      }
      
      // USA A FUNÇÃO DO CONFIG
      const position = e.detail.position || getPositionForItemType(e.detail.type);
      
      const itemToDrop = {
        ...e.detail,
        position: position,
        id: e.detail.id || `${e.detail.type}_${Date.now()}`
      };
      
      console.log(`📍 [${panelId}] Dropping item at:`, position);
      onItemDrop(itemToDrop);
    };

    const container = document.querySelector(`.character-body[data-panel-id="${panelId}"]`);
    if (container) {
      container.addEventListener('carousel-item-drop', handleCarouselDrop);
    }

    return () => {
      if (container) {
        container.removeEventListener('carousel-item-drop', handleCarouselDrop);
      }
    };
  }, [panelId, onItemDrop]);

  const handleItemUpdate = (updatedItem) => {
    onItemUpdate(updatedItem);
  };

  return (
    <div 
      className="character-body"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-panel-id={panelId}
    >
      {/* Silhueta vetorial */}
      <div className="character-silhouette">
        <img 
          src={characterSilhouette} 
          alt="Character Silhouette" 
          className="silhouette-image"
        />
      </div>
      
      {/* Items colocados */}
      {characterItems.map((item) => (
        <CharacterItem
          key={`${panelId}-${item.id}`}
          item={item}
          isSelected={selectedItem?.id === item.id}
          onSelect={onItemSelect}
          onUpdate={handleItemUpdate}
          panelId={panelId}
        />
      ))}
      
      {characterItems.length === 0 && (
        <div className="drop-hint">
          <p>Arrasta os itens para criares a tua personagem!</p>
        </div>
      )}
    </div>
  );
}

export default CharacterBody;