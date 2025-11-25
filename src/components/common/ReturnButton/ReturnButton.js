import './ReturnButton.css';

function ReturnButton({ onClick }) {
  return (
    <div className="return-button" onClick={onClick}>
      «
    </div>
  );
}

export default ReturnButton;