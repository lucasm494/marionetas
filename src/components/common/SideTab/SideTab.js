
import './SideTab.css';

function SideTab({ 
  icon, 
  title,
  selectedColor, 
  isOpen, 
  onToggle, 
  children, 
  itemCount = 0,
  position = 'left',
  panelId // ← NOVO: Recebe identificador do painel
}) {
  
  const handleToggle = (e) => {
    // Previne comportamentos indesejados em multitouch
    if (e.type === 'touchstart') {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log(`📂 [${panelId || 'SideTab'}] Tab toggled: ${title}, was open: ${isOpen}`);
    onToggle();
  };

  return (
    <div 
      className={`side-tab side-tab-${position} ${isOpen ? 'side-tab-open' : ''}`}
      data-panel-id={panelId}
    >
      {/* Tab Trigger */}
      <div 
        className="side-tab-trigger"
        onClick={handleToggle}
        onTouchStart={handleToggle} // ← Suporte a touch
        title={title}
        data-tab-title={title}
        data-panel-id={panelId}
      >
        { title !== "Colors" ?
          <div className="tab-icon">
            <img src={icon} alt="" style={{width:30 , height:30}}></img>
          </div>
          : 
          <div className="tab-icon">
            <div style={{width:30 , height:30, background:`${selectedColor ? selectedColor : "white"}`, borderRadius:30}}></div>
          </div>
        }
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
