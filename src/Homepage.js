import './homepage.css';
import './charactercreation.css'
import { useState } from 'react';


function CharacterCreation() {
    return (
        <div className="characters-creation">
            <div className="character-left">
                <OneCharacterCreation 
                    character="Character 1"
                    // Pass any other props needed for the left side
                />
            </div>
            <div className="character-right">
                <OneCharacterCreation 
                    character="Character 2" 
                    // Pass any other props needed for the right side
                />
            </div>
        </div>
    );
}

function OneCharacterCreation(){
  const [currentView, setCurrentView] = useState('characters-creation');


  const handleBack = () => {
    setCurrentView('homepage');
  }

    return (
    <div className="page">

      <div className='left-side'>
        <button className='back-arrow'
        onClick={handleBack}>
          «
        </button>
        <div className='element-selectors'>
          <div className='element-selector'>
            TOOLBAR
          </div>
          <div className='element-selector'>
            TOOLBAR
          </div>
          <div className='element-selector'>
            TOOLBAR
          </div>
          <div className='element-selector'>
            TOOLBAR
          </div>
        </div>
        <div className='trash'>

        </div>
      </div>
      

      <div className="character">
          <div className='head'>
            
          </div>
          <div className='up'>
            <div className='left-arm'>
              
            </div>
            <div className='tronco'>
              
            </div>
            <div className='right-arm'>
              
            </div>
          </div>
          
          <div className='legs'>
            <div className='left-leg'>
              
            </div>
            <div className='right-leg'>
              
            </div>
          </div>
      </div>

      <div className='right-side'>
        <div className='character-adder'>
          TOOLBAR
        </div>
        <button className='done-btn'>
          DONE
        </button>
      </div>

        
        
    </div>
  );

}


function Homepage() {
  const [currentView, setCurrentView] = useState('homepage');

  const handleNewTheater = () => {
    setCurrentView('character-creation');
  }

  const handleBack = () => {
    setCurrentView('homepage');
  }

  if (currentView === 'character-creation') {
    return <CharacterCreation onBack={handleBack} />;
  }

  return (
    <div className="homepage">
        <h1>Início</h1>
        <div className="homepage-buttons">
          <button className="new-theater" onClick={handleNewTheater}>
            Novo Teatro
          </button>
          <button className="stored">Guardados</button>
        </div>
    </div>
  );
}

export default Homepage;