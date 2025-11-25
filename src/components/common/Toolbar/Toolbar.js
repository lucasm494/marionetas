import './Toolbar.css';

function Toolbar({ title, items = [], onItemSelect, isOpen, onToggle, type = 'character' }) {
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className={`toolbar toolbar-${type}`}>
      <div className="toolbar-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="toggle-icon">{isOpen ? '▼' : '►'}</span>
        <span className="item-count">({safeItems.length})</span>
      </div>
      {isOpen && (
        <div className="toolbar-content">
          {safeItems.length > 0 ? (
            safeItems.map((item, index) => (
              <div
                key={item.id || index}
                className={`toolbar-item ${item.category || ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                title={item.name}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="empty-message">
              No items available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Toolbar;