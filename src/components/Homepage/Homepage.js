// Homepage.js - Componente principal da página inicial
import { useState } from 'react';
import './Homepage.css';
import CharacterCreation from '../CharacterCreation/CharacterCreation';
import ScenarioSelection from '../ScenarioSelection/ScenarioSelection';
import Button from '../common/Button/Button';
import Theater from '../Theater/theater';
import { createCharacterImage } from '../../utils/characterRenderer'; // Importar utilitário

/**
 * Componente principal da homepage.
 * Controla a navegação entre as views principais: criação de personagem, seleção de cenário e teatro.
 */
function Homepage() {
  // Estado para controlar a view atual
  const [currentView, setCurrentView] = useState('homepage');
  // Estado para personagens criados
  const [createdCharacters, setCreatedCharacters] = useState([]);
  // Estado para personagens em edição
  const [editingCharacters, setEditingCharacters] = useState([]);
  const [chosenScenario, setChosenScenario] = useState([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [characterWithImages, setCharacterWithImages] = useState([]);

  // Inicia novo teatro, indo para criação de personagem
  const handleNewTheater = () => {
    setEditingCharacters([]);
    setCurrentView('character-creation');
  };

  // Homepage.js - Adicionar mais logs
const generateCharacterImages = async (characters) => {
  setIsGeneratingImages(true);
  
  try {
    console.log('\n=== GERAÇÃO DE IMAGENS INICIADA ===');
    console.log('Número de personagens:', characters.length);
    
    const charactersWithImages = [];
    
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      console.log(`\n--- Personagem ${i + 1}: ${character.name} ---`);
      
      // Debug detalhado dos itens
      console.log('Itens:');
      character.items?.forEach((item, j) => {
        console.log(`  ${j}. ${item.name} (${item.type})`);
        console.log(`     Image: ${item.image}`);
        console.log(`     Position: ${JSON.stringify(item.position)}`);
      });
      
      // Gerar imagem
      const characterImage = await createCharacterImage(character, {
        width: 300,
        height: 400,
        scale: 1, // Começar com 1 para debug mais rápido
        backgroundColor: 'transparent'
      });
      
      if (characterImage) {
        console.log(`✅ Imagem gerada para ${character.name}`);
        
        // Verificar tamanho da imagem
        console.log('Tamanho da Data URL:', characterImage.length, 'caracteres');
        console.log('Começo da Data URL:', characterImage.substring(0, 100));
        
        // Guardar
        charactersWithImages.push({
          ...character,
          characterImage
        });
      } else {
        console.log(`❌ Falha ao gerar imagem para ${character.name}`);
        charactersWithImages.push(character);
      }
    }
    
    console.log('\n=== RESULTADO FINAL ===');
    console.log(`Geradas: ${charactersWithImages.filter(c => c.characterImage).length}/${characters.length}`);
    
    return charactersWithImages;
    
  } catch (error) {
    console.error('❌ ERRO na geração de imagens:', error);
    return characters;
  } finally {
    setIsGeneratingImages(false);
  }
};

  // Quando termina a criação de personagens
  const handleCharactersComplete = async (characters) => {
    console.log('🎭 Personagens completados:', characters);
     // Gerar imagens para os personagens
    const charactersWithImages = await generateCharacterImages(characters);
    setCharacterWithImages(charactersWithImages);
    setCreatedCharacters(characters);
    setEditingCharacters(characters);
    setCurrentView('scenario-selection');
  };

  // Volta à homepage
  const handleBackToHome = () => {
    setCurrentView('homepage');
  };

  // Quando termina a seleção de cenário
  const handleScenarioComplete = (scenario) => {
    setChosenScenario(scenario)
    setCurrentView('theater');
  };

  // Renderiza a view de criação de personagem
  if (currentView === 'character-creation') {
    return (
      <CharacterCreation 
        onBack={handleBackToHome}
        onComplete={handleCharactersComplete}
        initialCharacters={editingCharacters.length > 0 ? editingCharacters : undefined}
      />
    );
  }

  // Renderiza a view de seleção de cenário
  if (currentView === 'scenario-selection') {
    return (
      <ScenarioSelection 
        onBack={() => setCurrentView('character-creation')}
        onComplete={handleScenarioComplete}
        initialScenario={chosenScenario ? chosenScenario : undefined}
      />
    );
  }

  // Renderiza a view do teatro
  if (currentView === 'theater') {
    return (
      <Theater 
        characters={characterWithImages} 
        scenario = {chosenScenario}
        onBack={() => setCurrentView('scenario-selection')} 
      />
    );
  }

  // Renderiza a homepage inicial
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

// Exporta o componente Homepage
export default Homepage;