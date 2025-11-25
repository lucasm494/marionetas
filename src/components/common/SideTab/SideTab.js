import './SideTab.css';

function SideTab({ 
  icon, 
  title, 
  isOpen, 
  onToggle, 
  children, 
  itemCount = 0,
  position = 'left' 
}) {
  return (
    <div className={`side-tab side-tab-${position} ${isOpen ? 'side-tab-open' : ''}`}>
      {/* Tab Trigger */}
      <div 
        className="side-tab-trigger"
        onClick={onToggle}
        title={title}
      >
        <div className="tab-icon">
          {icon}
        </div>
        {itemCount > 0 && (
          <div className="tab-badge">
            {itemCount}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="side-tab-content">
        <div className="tab-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SideTab;