
import { useState, useEffect, useRef } from 'react';
import './OneCharacterCreation.css';
import ReturnButton from '../../common/ReturnButton/ReturnButton';
import TrashButton from '../../common/TrashButton/TrashButton';
import DoneButton from '../../common/DoneButton/DoneButton';
import SideTab from '../../common/SideTab/SideTab';
import Carousel from '../../common/Carousel/Carousel';
import CharacterBody from '../CharacterBody/CharacterBody';
import { characterToolbarItems, characterTabConfig } from '../../../data/toolbarItems';

function OneCharacterCreation({ 
  character: initialCharacter, 
  onBack, 
  onDone,
  onSaveCharacter,
  existingCharacters = [],
  onAddNewCharacter,
  onSwitchCharacter,
  onRemoveCharacter,
  isActivePanel = true,
  panelId // ← NOVO: Recebe identificador único
}) {
  const [characterItems, setCharacterItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openTab, setOpenTab] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  // Adiciona este state no início do componente:
const [isAddingNewCharacter, setIsAddingNewCharacter] = useState(false);
  
  // Ref para controlar save
  const saveTimeoutRef = useRef(null);

  // Carrega o personagem atual quando muda
  useEffect(() => {
    console.log('current character: ', initialCharacter )
    if (initialCharacter) {
      console.log(`📥 [${panelId}] Loading character:`, initialCharacter.name, 'Items:', initialCharacter.items?.length || 0);
      setCurrentCharacter(initialCharacter);
      setCharacterItems(initialCharacter.items || []);
      setSelectedItem(null);
      setSelectedColor(null);
    }
  }, [initialCharacter, panelId]);

  const handleItemDrop = (item) => {
    console.log(`📦 [${panelId}] Handle item drop received:`, item);
    let updatedItems;
    
    // Se o item já existe (tem id), atualiza apenas a posição
    if (item.id && characterItems.some(i => i.id === item.id)) {
      console.log(`📍 [${panelId}] Updating existing item position`);
      updatedItems = characterItems.map(i => 
        i.id === item.id ? { ...i, position: item.position } : i
      );
    } else {
      // Adiciona novo item com id único
      const newItem = {
        ...item,
        id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        position: item.position || { x: 50, y: 50 },
      };
      
      console.log(`➕ [${panelId}] Adding new item:`, newItem);
      
      // Remove outros itens do mesmo tipo (exceto cores)
      if (item.type !== 'color') {
        const filteredItems = characterItems.filter(i => i.type !== newItem.type);
        updatedItems = [...filteredItems, newItem];
        setSelectedItem(newItem);
      } else {
        updatedItems = [...characterItems, newItem];
      }
    }
    
    setCharacterItems(updatedItems);
    console.log(`📊 [${panelId}] Character items after update:`, updatedItems);
  };

  const handleColorSelect = (colorItem) => {
  console.log(`🎨 [${panelId}] Color clicked:`, colorItem.color, 'Current selected:', selectedColor);
  
  // Only process color selection if colors tab is open
  if (openTab !== 'colors') {
    console.log(`🎨 [${panelId}] Colors tab not open, ignoring color selection`);
    return;
  }
  
  // Se clicou na mesma cor, desseleciona apenas a seleção visual
  if (selectedColor === colorItem.color) {
    console.log(`🎨 [${panelId}] Color deselected from UI`);
    setSelectedColor(null);
    // Don't remove color from item - keep it so painting still works
    return;
  }
  
  // Seleciona a nova cor
  console.log(`🎨 [${panelId}] New color selected:`, colorItem.color);
  setSelectedColor(colorItem.color);
  
  // Aplica ao item selecionado
  if (selectedItem) {
    console.log(`🔄 [${panelId}] Applying color to item:`, selectedItem.name);
    const updatedItems = characterItems.map(item =>
      item.id === selectedItem.id ? { 
        ...item, 
        color: colorItem.color,
        // Não limpa paintedImage aqui - mantém o que foi pintado
      } : item
    );
    setCharacterItems(updatedItems);
  }
};

  const handleItemUpdate = (updatedItem) => {
    console.log(`✏️ [${panelId}] Updating item:`, updatedItem.name);
    const updatedItems = characterItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCharacterItems(updatedItems);
    
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleTrashDrop = (itemData) => {
    try {
      const item = JSON.parse(itemData);
      const updatedItems = characterItems.filter(i => i.id !== item.id);
      setCharacterItems(updatedItems);
      setSelectedItem(null);
      setSelectedColor(null);
      console.log(`🗑️ [${panelId}] Item removed:`, item.name);
    } catch (error) {
      console.error(`❌ [${panelId}] Error parsing item for trash:`, error);
    }
  };

  const handleItemSelect = (item) => {
    console.log(`📌 [${panelId}] Item selected:`, item.name, 'Current color:', item.color);
    setSelectedItem(item);
    // Don't auto-select color when selecting an item - user must explicitly select color
  };

  // Substitui a função toggleTab por:
const toggleTab = (tabName) => {
  console.log(`📂 [${panelId}] Toggling tab:`, tabName, 'Current open:', openTab);
  
  // Se está a abrir a tab de characters, primeiro fecha qualquer tab aberta
  // e só depois de um delay abre a nova
  if (tabName === 'characters' && openTab !== 'characters') {
    // 1. Fecha a tab atual (se houver)
    setOpenTab(null);
    
    // 2. Espera um pouco para a animação de fechar
    setTimeout(() => {
      // 3. Abre a tab de characters
      setOpenTab('characters');
      console.log(`✅ [${panelId}] Tab de characters aberta após delay`);
    }, 100); // 100ms é suficiente para o clique "passar"
    
    return;
  }
  
  // Para outras tabs, comportamento normal
  setOpenTab(openTab === tabName ? null : tabName);
};

  // Atualiza o handleAddCharacter:
const handleAddCharacter = () => {
  console.log(`👥 [${panelId}] Add character clicked`);
  
  // SETAR A FLAG ANTES DE QUALQUER COISA
  setIsAddingNewCharacter(true);
  
  if (characterItems.length === 0) {
    alert('Please add at least one item to your character before creating a new character.');
    setIsAddingNewCharacter(false);
    return;
  } else {
    // Cria o objeto do personagem completo
    const completedCharacter = {
      ...currentCharacter,
      items: characterItems,
      updatedAt: new Date().toISOString(),
      isSaved: true
    };
    onSaveCharacter && onSaveCharacter(completedCharacter);
  }
  
  // Pequeno timeout para garantir a ordem das operações
  setTimeout(() => {
    if (onAddNewCharacter) {
      onAddNewCharacter(currentCharacter);
    }
    // Remover a flag após as operações completarem
    setTimeout(() => setIsAddingNewCharacter(false), 500);
  }, 50);
};

  // Atualiza o handleCharacterSelect para ignorar se estiver a adicionar novo:
const handleCharacterSelect = (character) => {
  // SE ESTIVER A ADICIONAR NOVO, IGNORAR
  if (isAddingNewCharacter) {
    console.log(`⏸️ [${panelId}] Ignorando seleção - a adicionar novo personagem`);
    return;
  }

  // Verifica se deve remover o atual antes de trocar
  if (characterItems.length === 0 && currentCharacter && currentCharacter.id) {
    console.log(`🗑️ [${panelId}] Removendo personagem vazio antes de trocar`);
    onRemoveCharacter && onRemoveCharacter(currentCharacter.id);
  }

  console.log(`👤 [${panelId}] Character selected:`, character.name);

  if (characterItems.length > 0){
  // Cria o objeto do personagem completo
    const completedCharacter = {
      ...currentCharacter,
      items: characterItems,
      updatedAt: new Date().toISOString(),
      isSaved: true
    };
    onSaveCharacter && onSaveCharacter(completedCharacter);
    }
  
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  
  if (onSwitchCharacter) {
    const success = onSwitchCharacter(character, panelId);
    if (!success) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  }
};

  const handleDesselect = () => { 


    
  }


  const handleDoneClick = () => {
    console.log(`✅ [${panelId}] Done clicked`);
    // Força save imediato antes de completar
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (characterItems.length === 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    
    // Cria o objeto do personagem completo
    const completedCharacter = {
      ...currentCharacter,
      items: characterItems,
      updatedAt: new Date().toISOString(),
      isSaved: true
    };
    
    console.log(`✅ [${panelId}] Character completed:`, completedCharacter);
    
    // Garante que está guardado
    if (onSaveCharacter) {
      onSaveCharacter(completedCharacter);
    }
    
    // Chama a callback de done
    if (onDone) {
      onDone(completedCharacter);
    }
  };

  // Cleanup timeout no unmount
  useEffect(() => {
    const timeout = saveTimeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <div className="character-creation-page" data-panel-id={panelId} onClick={handleDesselect}>
      {/* Left Side - Grid interna */}
      <div className="left-side-tabs">
        <ReturnButton onClick={onBack} />
        
        <div className="tabs-container">
          {/* Clothing/Accessory Tabs */}
          {Object.entries(characterTabConfig).map(([tabKey, config]) => (
            <SideTab
              key={`${panelId}-${tabKey}`} // ← CHAVE ÚNICA
              icon={config.icon}
              title={config.title}
              selectedColor={selectedColor}
              isOpen={openTab === tabKey}
              onToggle={() => toggleTab(tabKey)}
              itemCount={characterToolbarItems[tabKey]?.length || 0}
              position="left"
              panelId={panelId} // ← Passa panelId para o SideTab
            >
              {tabKey === 'colors' ? (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleColorSelect}
                  type="colors"
                  selectedColor={selectedColor}
                  panelId={panelId} // ← Passa panelId para o Carousel
                />
              ) : (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleItemDrop}
                  type="items"
                  panelId={panelId} // ← Passa panelId para o Carousel
                />
              )}
            </SideTab>
          ))}
        </div>

        <TrashButton onDrop={handleTrashDrop} panelId={panelId} />
      </div>

      {/* Center - Character Area */}
      <div className="character-body-area">
        <CharacterBody
          characterItems={characterItems}
          onItemDrop={handleItemDrop}
          onItemSelect={handleItemSelect}
          onItemUpdate={handleItemUpdate}
          selectedItem={selectedItem}
          panelId={panelId} // ← Passa panelId para o CharacterBody
          selectedColor={selectedColor}
        />
        
        {/* Warning message */}
        {showWarning && (
          <div className="warning-message">
            <p>
              {characterItems.length === 0 
                ? 'Adiciona pelo menos um item à tua personagem' 
                : 'Esta personagem está a ser editada pelo teu amigo'}
            </p>
          </div>
        )}
      </div>

      {/* Right Side - Grid interna */}
      <div className="right-side-tabs">
        <SideTab
          icon="/images/plus.png"
          title="Characters"
          isOpen={openTab === 'characters'}
          onToggle={() => toggleTab('characters')}
          itemCount={existingCharacters.length}
          position="right"
          panelId={panelId} // ← Passa panelId para o SideTab
        >
          <Carousel
            items={existingCharacters}
            onItemSelect={handleCharacterSelect}
            onAddNew={handleAddCharacter}
            type="characters"
            showAddButton={characterItems.length > 0}
            panelId={panelId} // ← Passa panelId para o Carousel
          />
        </SideTab>

        <DoneButton 
          onClick={handleDoneClick}
          disabled={characterItems.length === 0}
          panelId={panelId} // ← Passa panelId para o DoneButton
        />
      </div>
    </div>
  );
}

export default OneCharacterCreation;
