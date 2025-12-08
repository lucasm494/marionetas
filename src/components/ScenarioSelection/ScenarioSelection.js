import React, { useState, useEffect } from 'react';
import './ScenarioSelection.css';
import Button from '../common/Button/Button';
import DoneButton from '../common/DoneButton/DoneButton';

import images from '../../data/images';
import ReturnButton from '../common/ReturnButton/ReturnButton';
import '../common/ReturnButton/ReturnButton.css';

function ScenarioSelection({ onBack , onComplete, initialScenario }) {
  
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarioImages = [images.scenario1, images.scenario2, images.scenario3, images.scenario4];

  const handleScenarioClick = (scenario) => {
    console.log('clicked: ', scenario);
    setSelectedScenario(scenario);
  };

  const handleDoneClick = () => {
    if (selectedScenario !== null){
      if (onComplete)
        onComplete(selectedScenario);
    }else{
      console.log('nothing selected');
    }
  }

  useEffect(() => {
    const scenario = initialScenario ? initialScenario : null;
    setSelectedScenario(scenario);

  },[initialScenario]);

  return (
<>
    <ReturnButton onClick={onBack} />

    <div className="scenario-selection">

      <h2>Escolhe um dos cenários</h2>
     
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


    {/* <Button onClick={onBack}>Voltar</Button> 
    <ReturnButton onClick={onBack} />*/ }
      <DoneButton onClick={handleDoneClick} />
    </div>
    </>
  );
}

export default ScenarioSelection;