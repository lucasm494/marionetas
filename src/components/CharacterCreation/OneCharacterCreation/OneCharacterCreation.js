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
  isActivePanel = true,
  panelSide = 'left'
}) {
  const [characterItems, setCharacterItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openTab, setOpenTab] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  
  // Ref para controlar save
  const saveTimeoutRef = useRef(null);

  // Carrega o personagem atual quando muda
  useEffect(() => {
    if (initialCharacter) {
      console.log('📥 Loading character:', initialCharacter.name, 'Panel:', panelSide, 'Items:', initialCharacter.items?.length || 0);
      setCurrentCharacter(initialCharacter);
      setCharacterItems(initialCharacter.items || []);
      setSelectedItem(null);
      setSelectedColor(null);
    }
  }, [initialCharacter, panelSide]);

  // Salva automaticamente quando characterItems muda
  useEffect(() => {
    if (!currentCharacter || characterItems.length === 0) return;
    
    // Debounce para evitar saves excessivos
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const characterToSave = {
        ...currentCharacter,
        items: [...characterItems], // Cópia do array
        updatedAt: new Date().toISOString(),
        isSaved: true
      };
      
      console.log('💾 Auto-saving character:', currentCharacter.name, 'Items count:', characterItems.length);
      
      if (onSaveCharacter) {
        onSaveCharacter(characterToSave);
      }
    }, 400); // 400ms debounce
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [characterItems, currentCharacter, onSaveCharacter]);

  const handleItemDrop = (item) => {
    let updatedItems;
    
    if (item.id && characterItems.some(i => i.id === item.id)) {
      // Atualiza item existente (posição)
      updatedItems = characterItems.map(i => 
        i.id === item.id ? { ...i, position: item.position } : i
      );
      console.log('📍 Item position updated');
    } else {
      // Adiciona novo item
      const newItem = {
        ...item,
        id: Date.now() + Math.random(),
        position: item.position || item.defaultPosition || { x: 50, y: 50 },
      };
      
      if (item.type !== 'color') {
        // Remove outros itens do mesmo tipo (exceto cores)
        const filteredItems = characterItems.filter(i => i.type !== newItem.type);
        updatedItems = [...filteredItems, newItem];
        setSelectedItem(newItem);
        console.log('➕ New item added');
      } else {
        updatedItems = [...characterItems];
      }
    }
    
    setCharacterItems(updatedItems);
  };

  const handleColorSelect = (colorItem) => {
    console.log('🎨 Color clicked:', colorItem.color, 'Current selected:', selectedColor);
    
    // Se clicou na mesma cor, desseleciona
    if (selectedColor === colorItem.color) {
      console.log('🎨 Color deselected');
      setSelectedColor(null);
      
      if (selectedItem) {
        const updatedItems = characterItems.map(item =>
          item.id === selectedItem.id ? { ...item, color: null } : item
        );
        setCharacterItems(updatedItems);
      }
      return;
    }
    
    // Seleciona a nova cor
    console.log('🎨 New color selected:', colorItem.color);
    setSelectedColor(colorItem.color);
    
    // Aplica ao item selecionado
    if (selectedItem) {
      console.log('🔄 Applying color to item:', selectedItem.name);
      const updatedItems = characterItems.map(item =>
        item.id === selectedItem.id ? { ...item, color: colorItem.color } : item
      );
      setCharacterItems(updatedItems);
    }
  };

  // ... restante do código permanece igual ...

  const handleItemUpdate = (updatedItem) => {
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
      console.log('🗑️ Item removed');
      

    } catch (error) {
      console.error('❌ Error parsing item for trash:', error);
    }
  };

  const handleItemSelect = (item) => {
    console.log('📌 Item selected:', item.name, 'Current color:', item.color);
    setSelectedItem(item);
    
    if (item.color) {
      setSelectedColor(item.color);
    } else {
      setSelectedColor(null);
    }
  };

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  const handleAddCharacter = () => {
    if (onAddNewCharacter) {
      const newCharacter = onAddNewCharacter();
      if (newCharacter) {
        console.log('👥 New character created:', newCharacter);
        // Limpa timeout pendente
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        // Atualiza para o novo personagem
        setCurrentCharacter(newCharacter);
        setCharacterItems([]);
        setSelectedItem(null);
        setSelectedColor(null);
      } else {
        // Mostra aviso se não pode criar
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    }
  };

  const handleCharacterSelect = (character) => {
    console.log('👤 Character selected:', character.name);
    
    // Limpa timeout pendente antes de mudar
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Tenta alternar para o personagem selecionado
    if (onSwitchCharacter) {
      const success = onSwitchCharacter(character, panelSide);
      if (!success) {
        // Mostra aviso se o personagem já está sendo editado
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    }
  };

  const handleDoneClick = () => {
    // Força save imediato antes de completar
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (characterItems.length === 0) {
      alert('Please add at least one item to your character before completing.');
      return;
    }
    
    // Cria o objeto do personagem completo
    const completedCharacter = {
      ...currentCharacter,
      items: characterItems,
      updatedAt: new Date().toISOString(),
      isSaved: true
    };
    
    console.log('✅ Character completed:', completedCharacter);
    
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
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="character-creation-page">
      {/* Left Side - Grid interna */}
      <div className="left-side-tabs">
        <ReturnButton onClick={onBack} />
        
        <div className="tabs-container">
          {/* Clothing/Accessory Tabs */}
          {Object.entries(characterTabConfig).map(([tabKey, config]) => (
            <SideTab
              key={tabKey}
              icon={config.icon}
              title={config.title}
              isOpen={openTab === tabKey}
              onToggle={() => toggleTab(tabKey)}
              itemCount={characterToolbarItems[tabKey]?.length || 0}
              position="left"
            >
              {tabKey === 'colors' ? (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleColorSelect}
                  type="colors"
                  selectedColor={selectedColor}
                />
              ) : (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleItemDrop}
                  type="items"
                />
              )}
            </SideTab>
          ))}
        </div>

        <TrashButton onDrop={handleTrashDrop} />
      </div>

      {/* Center - Character Area */}
      <div className="character-body-area">
        <CharacterBody
          characterItems={characterItems}
          onItemDrop={handleItemDrop}
          onItemSelect={handleItemSelect}
          onItemUpdate={handleItemUpdate}
          selectedItem={selectedItem}
        />
        
        {/* Warning message */}
        {showWarning && (
          <div className="warning-message">
            <p>
              {characterItems.length === 0 
                ? 'Add at least one item to create a new character' 
                : 'This character is already being edited in the other panel'}
            </p>
          </div>
        )}
        
        {/* Character name display */}
        <div className="character-name-display">
          <h3>{currentCharacter?.name || 'Unnamed Character'}</h3>
          {characterItems.length === 0 && (
            <p className="hint">Add items to save this character</p>
          )}
        </div>
      </div>

      {/* Right Side - Grid interna */}
      <div className="right-side-tabs">
        <SideTab
          icon="👥"
          title="Characters"
          isOpen={openTab === 'characters'}
          onToggle={() => toggleTab('characters')}
          itemCount={existingCharacters.length}
          position="right"
        >
          <Carousel
            items={existingCharacters}
            onItemSelect={handleCharacterSelect}
            onAddNew={handleAddCharacter}
            type="characters"
            showAddButton={characterItems.length > 0}
          />
        </SideTab>

        <DoneButton 
          onClick={handleDoneClick}
          disabled={characterItems.length === 0}
        />
      </div>
    </div>
  );
}

export default OneCharacterCreation;