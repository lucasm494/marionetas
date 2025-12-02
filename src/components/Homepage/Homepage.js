import { useState } from 'react';
import './Homepage.css';
import CharacterCreation from '../CharacterCreation/CharacterCreation';
import ScenarioCreation from '../ScenarioCreation/ScenarioCreation';
import ScenarioSelection from '../ScenarioSelection/ScenarioSelection';
import Button from '../common/Button/Button';

function Homepage() {
  const [currentView, setCurrentView] = useState('homepage');
  const [createdCharacters, setCreatedCharacters] = useState([]);

  const handleNewTheater = () => {
    setCurrentView('character-creation');
  };

  const handleCharactersComplete = (characters) => {
    setCreatedCharacters(characters);
    setCurrentView('scenario-selection');
  };

  const handleBackToHome = () => {
    setCurrentView('homepage');
  };

  const handleScenarioComplete = () => {
    // Handle theater completion
    setCurrentView('homepage');
    alert('Theater created successfully!');
  };

  if (currentView === 'character-creation') {
    return (
      <CharacterCreation 
        onBack={handleBackToHome}
        onComplete={handleCharactersComplete}
      />
    );
  }

  if (currentView === 'scenario-creation') {
    return (
      <ScenarioCreation 
        onBack={() => setCurrentView('character-creation')}
        onComplete={handleScenarioComplete}
        characters={createdCharacters}
      />
    );
  }

  if (currentView === 'scenario-selection') {
    return (
      <ScenarioSelection 
        onBack={() => setCurrentView('character-creation')}
        characters={createdCharacters}
      />
    );
  }

  return (
    <div className="homepage">
      <h1>Início</h1>
      <div className="homepage-buttons">
        <Button onClick={handleNewTheater} className="new-theater">
          Novo Teatro
        </Button>
        <Button className="stored">
          Guardados
        </Button>
      </div>
    </div>
  );
}

export default Homepage;