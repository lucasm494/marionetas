import './TrashButton.css';

function TrashButton({ onDrop }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (itemData && onDrop) {
      onDrop(itemData);
    }
  };

  return (
    <div 
      className="trash-button"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      title="Drag items here to delete"
    >
      <img src="/images/trash.png" alt="" style={{width:30 , height:30}} />
    </div>
  );
}

export default TrashButton;