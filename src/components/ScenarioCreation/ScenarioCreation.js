import { useState } from 'react';
import './ScenarioCreation.css';
import ScenarioCanvas from './ScenarioCanvas/ScenarioCanvas';
import ReturnButton from '../common/ReturnButton/ReturnButton';
import TrashButton from '../common/TrashButton/TrashButton';
import DoneButton from '../common/DoneButton/DoneButton';
import Toolbar from '../common/Toolbar/Toolbar';
import { scenarioToolbarItems } from '../../data/toolbarItems';

function ScenarioCreation({ onBack, onComplete, characters }) {
  const [scenarioItems, setScenarioItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openToolbar, setOpenToolbar] = useState(null);
  const [createdScenarios, setCreatedScenarios] = useState([]);

  const handleItemSelect = (item) => {
    // This is called when dragging starts from toolbar
  };

  const handleItemDrop = (item) => {
    const newItem = {
      ...item,
      id: Date.now(), // Unique ID
      position: { x: 100, y: 100 }, // Default position
      rotation: 0,
      scale: 1,
      zIndex: scenarioItems.length
    };
    setScenarioItems([...scenarioItems, newItem]);
  };

  const handleTrashDrop = (item) => {
    setScenarioItems(scenarioItems.filter(i => i.id !== item.id));
    setSelectedItem(null);
  };

  const handleItemUpdate = (itemId, updates) => {
    setScenarioItems(scenarioItems.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const toggleToolbar = (toolbarName) => {
    setOpenToolbar(openToolbar === toolbarName ? null : toolbarName);
  };

  const handleAddScenario = () => {
    // Logic to add another scenario
    const newScenarioId = createdScenarios.length + 1;
    setCreatedScenarios([...createdScenarios, { id: newScenarioId, name: `Scenario ${newScenarioId}` }]);
  };

  const handleScenarioSelect = (scenarioId) => {
    // Logic to switch between scenarios
    console.log('Selected scenario:', scenarioId);
  };

  return (
    <div className="scenario-creation">
      {/* Left Side - Toolbars */}
      <div className="scenario-left-side">
        <ReturnButton onClick={onBack} />
        
        <div className="scenario-toolbars">
          <Toolbar
            title="Backgrounds"
            items={scenarioToolbarItems.backgrounds}
            isOpen={openToolbar === 'backgrounds'}
            onToggle={() => toggleToolbar('backgrounds')}
            onItemSelect={handleItemSelect}
            type="scenario"
          />
          <Toolbar
            title="Nature"
            items={scenarioToolbarItems.nature}
            isOpen={openToolbar === 'nature'}
            onToggle={() => toggleToolbar('nature')}
            onItemSelect={handleItemSelect}
            type="scenario"
          />
          <Toolbar
            title="Furniture"
            items={scenarioToolbarItems.furniture}
            isOpen={openToolbar === 'furniture'}
            onToggle={() => toggleToolbar('furniture')}
            onItemSelect={handleItemSelect}
            type="scenario"
          />
          <Toolbar
            title="Characters"
            items={characters}
            isOpen={openToolbar === 'characters'}
            onToggle={() => toggleToolbar('characters')}
            onItemSelect={handleItemSelect}
            type="scenario"
          />
        </div>

        <TrashButton onDrop={handleTrashDrop} />
      </div>

      {/* Center - Scenario Canvas */}
      <div className="scenario-center">
        <ScenarioCanvas
          items={scenarioItems}
          selectedItem={selectedItem}
          onItemDrop={handleItemDrop}
          onItemSelect={setSelectedItem}
          onItemUpdate={handleItemUpdate}
        />
        
        {/* Transformation Controls */}
        {selectedItem && (
          <div className="transformation-controls">
            <div className="control-group">
              <label>Size:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={selectedItem.scale || 1}
                onChange={(e) => handleItemUpdate(selectedItem.id, { scale: parseFloat(e.target.value) })}
              />
            </div>
            <div className="control-group">
              <label>Rotation:</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={selectedItem.rotation || 0}
                onChange={(e) => handleItemUpdate(selectedItem.id, { rotation: parseInt(e.target.value) })}
              />
            </div>
            <button 
              className="control-button"
              onClick={() => setSelectedItem(null)}
            >
              Deselect
            </button>
          </div>
        )}
      </div>

      {/* Right Side - Scenario Management */}
      <div className="scenario-right-side">
        <Toolbar
          title="Created Scenarios"
          items={createdScenarios}
          isOpen={true}
          onItemSelect={(scenario) => handleScenarioSelect(scenario.id)}
          type="scenario-list"
        />
        
        <button className="add-scenario-btn" onClick={handleAddScenario}>
          + Add Another Scenario
        </button>

        <DoneButton 
          onClick={onComplete}
          disabled={scenarioItems.length === 0}
        />
      </div>
    </div>
  );
}

export default ScenarioCreation;