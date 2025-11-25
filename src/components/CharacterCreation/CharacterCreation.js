import { useState } from 'react';
import './CharacterCreation.css';
import OneCharacterCreation from './OneCharacterCreation/OneCharacterCreation';

function CharacterCreation({ onBack, onComplete }) {
  const [completedCharacters, setCompletedCharacters] = useState([]);

  const handleCharacterDone = (characterId) => {
    const newCompletedCharacters = [...completedCharacters, characterId];
    setCompletedCharacters(newCompletedCharacters);
    
    // If both characters are done, move to scenario creation
    // For now, let's just complete after one character for testing
    if (newCompletedCharacters.length >= 1) {
      onComplete(newCompletedCharacters);
    }
  };

  return (
    <div className="characters-creation">
      <div className="character-left">
        <OneCharacterCreation 
          character="Character 1"
          onBack={onBack}
          onDone={() => handleCharacterDone(1)}
        />
      </div>
      <div className="character-right">
        <OneCharacterCreation 
          character="Character 2"
          onBack={onBack}
          onDone={() => handleCharacterDone(2)}
        />
      </div>
    </div>
  );
}

export default CharacterCreation;