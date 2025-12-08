import './ReturnButton.css';

function ReturnButton({ onClick }) {
  return (
    <div className="return-button" onClick={onClick}>
      <img src="/images/arrow.png" alt="" className='arrow'></img>
    </div>
  );
}

export default ReturnButton;