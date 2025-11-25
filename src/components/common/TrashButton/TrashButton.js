import './TrashButton.css';

function TrashButton({ onDrop }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData) {
      onDrop(JSON.parse(itemData));
    }
  };

  return (
    <div 
      className="trash-button"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      🗑️
    </div>
  );
}

export default TrashButton;