import { useState } from 'react';
import OneCharacterCreation from './OneCharacterCreation';
import './charactercreation.css'; // Make sure to create this CSS file

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
