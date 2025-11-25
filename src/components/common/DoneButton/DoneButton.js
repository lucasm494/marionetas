import Button from '../Button/Button';

function DoneButton({ onClick, disabled = false }) {
  return (
    <Button 
      variant="done" 
      onClick={onClick}
      disabled={disabled}
      className="done-button"
    >
      DONE
    </Button>
  );
}

export default DoneButton;