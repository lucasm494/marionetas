import './Button.css';

function Button({ children, onClick, variant = 'primary', className = '' }) {
  return (
    <button 
      className={`button button-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;