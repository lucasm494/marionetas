import './DoneButton.css';

function DoneButton({ onClick, disabled = false }) {
  return (
    <div 
      onClick={onClick}
      disabled={disabled}
      className="done-button"
    >
      <img src='/images/check.png' alt="" style={{width:20}}/>
    </div>
  );
}

export default DoneButton;