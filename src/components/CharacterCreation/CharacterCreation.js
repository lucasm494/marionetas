import { useState, useEffect } from 'react';
import './CharacterCreation.css';
import OneCharacterCreation from './OneCharacterCreation/OneCharacterCreation';

function CharacterCreation({ onBack, onComplete, initialCharacters }) {
  const [characters, setCharacters] = useState([]);
  const [currentCharacterLeft, setCurrentCharacterLeft] = useState(null);
  const [currentCharacterRight, setCurrentCharacterRight] = useState(null);
  const [leftDone, setLeftDone] = useState(false);
  const [rightDone, setRightDone] = useState(false);


  // Personagens iniciais (2 personagens vazias - ainda não guardadas)
  const defaultInitialCharacters = [
    {
      id: 1,
      name: 'Character 1',
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString(),
      isSaved: false
    },
    {
      id: 2,
      name: 'Character 2', 
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString(),
      isSaved: false
    }
  ];

  // Carrega personagens iniciais ou recebidos via prop
  useEffect(() => {
    const chars = initialCharacters && initialCharacters.length > 0 ? initialCharacters : defaultInitialCharacters;
    setCharacters(chars);
    setCurrentCharacterLeft(chars[0]);
    setCurrentCharacterRight(chars[1]);
  }, [initialCharacters]);

  // Alterna personagem ativo no painel
  const handleSwitchCharacter = (character, panelSide) => {
    if (!character || !character.isSaved) return false;
    // Impede alternar para personagem já em edição no outro painel
    if (panelSide === 'left') {
      if (currentCharacterRight && currentCharacterRight.id === character.id) return false;
      setCurrentCharacterLeft(character);
    } else {
      if (currentCharacterLeft && currentCharacterLeft.id === character.id) return false;
      setCurrentCharacterRight(character);
    }
    return true;
  };
  // Função para voltar da espera para edição
  const handleOverlayClick = (panel) => {
    console.log('Overlay clicked on panel:', panel);
    if (panel === 'left') setLeftDone(false);
    if (panel === 'right') setRightDone(false);
  };

  const handleRemoveCharacter = (characterId) => {
    console.log(`Removendo personagem: ${characterId}`);
    setCharacters(prev => prev.filter(char => char.id !== characterId));
    
    // Se o personagem removido é o atual em algum painel, limpe-o
    if (currentCharacterLeft && currentCharacterLeft.id === characterId) {
      setCurrentCharacterLeft(null);
    }
    if (currentCharacterRight && currentCharacterRight.id === characterId) {
      setCurrentCharacterRight(null);
    }
  };

  // Cria um novo personagem vazio se o atual tiver itens
  // Permite criar novo personagem mesmo se o outro painel estiver a editar
  const handleAddNewCharacter = (currentPanelCharacter) => {
    let newCharacter = null;
      // Create new character
      const newId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;
      newCharacter = {
        id: newId,
        name: `Character ${newId}`,
        emoji: '👤',
        items: [],
        createdAt: new Date().toISOString(),
        isSaved: false
      };
      setCharacters(prevCharacters => [...prevCharacters, newCharacter]);
      // Define o novo personagem no painel correto
      if (currentPanelCharacter.id === currentCharacterLeft.id) {
        setCurrentCharacterLeft(newCharacter);
      } else {
        setCurrentCharacterRight(newCharacter);
      }

    console.log('New character created:', newCharacter);
    return newCharacter;
  };

  // Retorna apenas personagens salvos (com itens)
  const getSavedCharacters = () => {
    return characters.filter(character => character.isSaved && character.items.length > 0);
  };

  // Função para marcar painel como done apenas ao clicar em Done e personagem estiver salvo
  const handlePanelDone = (panelId, character) => {
    console.log(`Panel ${panelId} done clicked for character:`, character.name);
    if (character.items && character.items.length > 0 && character.isSaved) {
      if (panelId === 'left-panel') setLeftDone(true);
      if (panelId === 'right-panel') setRightDone(true);
      console.log('Character is saved with items, marking panel as done.');
    }
    setCharacters(prevCharacters => {
      const existingIndex = prevCharacters.findIndex(c => c.id === character.id);
      let updatedCharacters;
      if (existingIndex >= 0) {
        updatedCharacters = [...prevCharacters];
        updatedCharacters[existingIndex] = character;
      } else {
        updatedCharacters = [...prevCharacters, character];
      }
      return updatedCharacters;
    });
    console.log('Left done:', leftDone, 'Right done:', rightDone);
    
  };

  useEffect(() => {
    if (leftDone && rightDone) {
      console.log('Both panels done. Completing character creation with characters:', characters);
      onComplete(characters);
    }
  }, [leftDone, rightDone, characters, onComplete]);

  const handleSaveCharacter = (character) => {
    console.log('💾 Parent: Saving character:', character.name);
    console.log('   Items received:', character.items);
    console.log('   Items count:', character.items?.length || 0);
    // Garantir que temos um array válido
    const items = Array.isArray(character.items) ? character.items : [];
    const characterToSave = {
      ...character,
      items: items,
      isSaved: items.length > 0,
      updatedAt: new Date().toISOString()
    };
    console.log('   Final items count to save:', characterToSave.items.length);
    setCharacters(prevCharacters => {
      const existingIndex = prevCharacters.findIndex(c => c.id === character.id);
      let updatedCharacters;
      if (existingIndex >= 0) {
        updatedCharacters = [...prevCharacters];
        updatedCharacters[existingIndex] = characterToSave;
        console.log('   Updated existing character');
      } else {
        updatedCharacters = [...prevCharacters, characterToSave];
        console.log('   Added new character');
      }
      return updatedCharacters;
    });
  };
    
  
 // Renderização dos painéis de criação de personagem
  return (
    <div className="characters-creation">
      <div className="character-left" style={{ position: 'relative' }}>
        <OneCharacterCreation
          character={currentCharacterLeft}
          onBack={onBack}
          onDone={(character) => handlePanelDone('left-panel', character)}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={getSavedCharacters()}
          onAddNewCharacter={() => handleAddNewCharacter(currentCharacterLeft)}
          onSwitchCharacter={(char) => handleSwitchCharacter(char, 'left')}
          onRemoveCharacter={handleRemoveCharacter}
          isActivePanel={true}
          panelId="left-panel"
          showWaitOverlay={leftDone && !rightDone}
        />
        {leftDone && !rightDone && (
          <div className="wait-overlay" onClick={() => handleOverlayClick('left')} style={{cursor: 'pointer'}}>
            <div className="wait-message">Aguarde que o outro personagem seja criado...<br/><span style={{fontSize:12}}>Clique para voltar à edição</span></div>
          </div>
        )}
      </div>
      <div className="character-right" style={{ position: 'relative' }}>
        <OneCharacterCreation
          character={currentCharacterRight}
          onBack={onBack}
          onDone={(character) => handlePanelDone('right-panel', character)}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={getSavedCharacters()}
          onAddNewCharacter={() => handleAddNewCharacter(currentCharacterRight)}
          onSwitchCharacter={(char) => handleSwitchCharacter(char, 'right')}
          onRemoveCharacter={handleRemoveCharacter}
          isActivePanel={true}
          panelId="right-panel"
          showWaitOverlay={rightDone && !leftDone}
        />
        {rightDone && !leftDone && (
          <div className="wait-overlay" onClick={() => handleOverlayClick('right')} style={{cursor: 'pointer'}}>
            <div className="wait-message">Aguarde que o outro personagem seja criado...<br/><span style={{fontSize:12}}>Clique para voltar à edição</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterCreation;
