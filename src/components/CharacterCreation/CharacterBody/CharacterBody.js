import './CharacterBody.css';

function CharacterBody({ characterItems, onItemDrop, onItemSelect }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      const item = JSON.parse(itemData);
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      onItemDrop({ ...item, position });
    }
  };

  return (
    <div 
      className="character-body"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Base skeleton */}
      <div className="character-base">
        <div className="head"></div>
        <div className="up">
          <div className="left-arm"></div>
          <div className="tronco"></div>
          <div className="right-arm"></div>
        </div>
        <div className="legs">
          <div className="left-leg"></div>
          <div className="right-leg"></div>
        </div>
      </div>
      
      {/* Placed items */}
      {characterItems.map((item, index) => (
        <div
          key={index}
          className="character-item"
          style={{
            left: item.position.x,
            top: item.position.y,
            color: item.color
          }}
          onClick={() => onItemSelect(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export default CharacterBody;