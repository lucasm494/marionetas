import React, { useState } from 'react';
import './ScenarioSelection.css';
import Button from '../common/Button/Button';
import images from '../../data/images';
import DoneButton from '../common/DoneButton/DoneButton';


function ScenarioSelection({ onBack , onComplete }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
  };

  const scenarioImages = [images.hat1, images.hat2, images.hat3, images.hat1];

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