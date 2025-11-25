import { useState } from 'react';
import './OneCharacterCreation.css';
import ReturnButton from '../../common/ReturnButton/ReturnButton';
import TrashButton from '../../common/TrashButton/TrashButton';
import DoneButton from '../../common/DoneButton/DoneButton';
import SideTab from '../../common/SideTab/SideTab';
import Carousel from '../../common/Carousel/Carousel';
import CharacterBody from '../CharacterBody/CharacterBody';
import { characterToolbarItems, characterTabConfig, colorPalette } from '../../../data/toolbarItems';

function OneCharacterCreation({ character, onBack, onDone }) {
  const [characterItems, setCharacterItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openTab, setOpenTab] = useState(null);
  const [createdCharacters, setCreatedCharacters] = useState([]);

  const handleItemDrop = (item) => {
    const newItem = {
      ...item,
      id: Date.now(),
      position: { x: 50, y: 50 }
    };
    setCharacterItems([...characterItems, newItem]);
  };

  const handleTrashDrop = (item) => {
    setCharacterItems(characterItems.filter(i => i.id !== item.id));
    setSelectedItem(null);
  };

  const handleColorSelect = (color) => {
    if (selectedItem) {
      const updatedItems = characterItems.map(item =>
        item.id === selectedItem.id ? { ...item, color } : item
      );
      setCharacterItems(updatedItems);
    }
  };

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  const handleAddCharacter = () => {
    const newCharacterId = createdCharacters.length + 1;
    const newCharacter = {
      id: newCharacterId,
      name: `Character ${newCharacterId}`,
      emoji: '👤'
    };
    setCreatedCharacters([...createdCharacters, newCharacter]);
  };

  const handleCharacterSelect = (character) => {
    console.log('Character selected:', character);
  };

  const handleDoneClick = () => {
    if (characterItems.length === 0) {
      alert('Please add at least one item to your character before completing.');
      return;
    }
    onDone();
  };

  return (
    <div className="character-creation-page">
      {/* Left Side - Circular Tabs */}
      <div className="left-side-tabs">
        <ReturnButton onClick={onBack} />
        
        {/* Clothing/Accessory Tabs */}
        <div className="tab-stack">
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
              <Carousel
                items={characterToolbarItems[tabKey] || []}
                onItemSelect={handleItemDrop}
                type="items"
              />
            </SideTab>
          ))}
        </div>

        {/* Color Picker Tab */}
        <SideTab
          icon="🎨"
          title="Colors"
          isOpen={openTab === 'colors'}
          onToggle={() => toggleTab('colors')}
          position="left"
        >
          <div className="color-picker-expanded">
            <div className="color-grid-expanded">
              {colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="color-swatch-expanded"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        </SideTab>

        <TrashButton onDrop={handleTrashDrop} />
      </div>

      {/* Center - Character */}
      <div className="character-body-area">
        <CharacterBody
          characterItems={characterItems}
          onItemDrop={handleItemDrop}
          onItemSelect={setSelectedItem}
        />
      </div>

      {/* Right Side - Character Management Tab */}
      <div className="right-side-tabs">
        <SideTab
          icon="👥"
          title="Characters"
          isOpen={openTab === 'characters'}
          onToggle={() => toggleTab('characters')}
          itemCount={createdCharacters.length}
          position="right"
        >
          <Carousel
            items={createdCharacters}
            onItemSelect={handleCharacterSelect}
            onAddNew={handleAddCharacter}
            type="characters"
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