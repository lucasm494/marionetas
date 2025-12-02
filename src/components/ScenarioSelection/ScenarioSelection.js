import React, { useState } from 'react';
import './ScenarioSelection.css';
import Button from '../common/Button/Button';
import hat1 from '../../assets/items/hat1.png';
import hat2 from '../../assets/items/hat2.png';
import hat3 from '../../assets/items/hat3.png';
import DoneButton from '../common/DoneButton/DoneButton';


function ScenarioSelection({ onBack , onComplete }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
  };

  const scenarioImages = [hat1, hat2, hat3, hat1];

  return (
    <div className="scenario-selection">
      <h2>Seleção de Cenário</h2>
      <p>Escolhe um dos 4.</p>
      <div className="scenario-grid">
        {scenarioImages.map((src, idx) => (
          <img
            key={idx}
            className={selectedScenario === idx + 1 ? 'scenario-selected' : 'scenario'}
            onClick={() => handleScenarioClick(idx + 1)}
            src={src}
            alt={`Cenário ${idx + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleScenarioClick(idx + 1);
              }
            }}
          />
        ))}
      </div>


      <Button onClick={onBack}>Voltar</Button>
      <DoneButton enabled={selectedScenario !== null} onClick={onComplete} />
    </div>
  );
}

export default ScenarioSelection;