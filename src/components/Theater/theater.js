
import React, { useEffect, useRef, useState } from 'react';
import './theater.css';
import ReturnButton from '../common/ReturnButton/ReturnButton';
import MovementPad from './MovementPad/MovementPad';
import ScreenRecorder from './ScreenRecorder/ScreenRecorder';
import images from '../../data/images';

function Theater({ onBack, characters = [], scenario }) {
	const stageRef = useRef(null);
	const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

	const scenarioImages = [images.scenario1, images.scenario2, images.scenario3, images.scenario4];

	// Initialize positions for each character
	const [characterPositions, setCharacterPositions] = useState(() => {
		const positions = [];
		for (let i = 0; i < characters.length; i++) {
			try {
				const raw = localStorage.getItem(`theater.char${i}.pos`);
				positions.push(raw ? JSON.parse(raw) : { 
					x: 0.2 + (i * 0.3), // Spread characters across stage
					y: 0.5 
				});
			} catch (err) {
				positions.push({ x: 0.2 + (i * 0.3), y: 0.5 });
			}
		}
		return positions;
	});

	useEffect(() => {
		const update = () => {
			if (stageRef.current) {
				const rect = stageRef.current.getBoundingClientRect();
				setStageSize({ width: rect.width, height: rect.height });
			}
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	// Update position handler for a specific character
	const updateCharacterPosition = (index, newPos) => {
		setCharacterPositions(prev => {
			const updated = [...prev];
			updated[index] = newPos;
			return updated;
		});
	};

	// Persist positions to localStorage
	useEffect(() => {
		characterPositions.forEach((pos, i) => {
			try {
				localStorage.setItem(`theater.char${i}.pos`, JSON.stringify(pos));
			} catch (err) {}
		});
	}, [characterPositions]);

	// Character dimensions
	const charWidth = Math.max(40, Math.round(stageSize.width * 0.06));
	const charHeight = Math.max(200, Math.round(stageSize.height * 0.12));

	return (
		<div className="theater">
			<ReturnButton onClick={onBack} />

			<div className="theater-center">
				{/* Aqui você pode adicionar outros elementos se necessário */}
			</div>

			{/* Full-viewport stage so the rectangle can move across entire screen */}
			<div className="theater-stage" ref={stageRef} style={{ backgroundImage: `url(${scenarioImages[scenario-1]})` }}>
				{characters.map((character, index) => {
					const pos = characterPositions[index] || { x: 0.5, y: 0.5 };
					const centerX = Math.round(pos.x * stageSize.width);
					const centerY = Math.round(pos.y * stageSize.height);
					const tx = centerX - Math.round(charWidth / 2);
					const ty = centerY - Math.round(charHeight / 2);

					return (
						<img
							key={`character-${index}`}
							className={`theater-rect theater-char-${index}`}
							src={character.characterImage}
							alt={character.name || `Character ${index + 1}`}
							style={{ 
								width: charWidth + 'px', 
								height: charHeight + 'px', 
								transform: `translate3d(${tx}px, ${ty}px, 0)` 
							}}
						/>
					);
				})}
			</div>

			{/* Adicione o ScreenRecorder aqui, em um local fixo */}
			<ScreenRecorder />

			{/* Movement pads for each character */}
			{characters.map((character, index) => {
				const pos = characterPositions[index] || { x: 0.5, y: 0.5 };
				const isLeft = index % 2 === 0;
				const padWidth = 12.5;
				const padPosition = isLeft
					? (Math.floor(index / 2) * padWidth)
					: (100 - ((Math.floor(index / 2) + 1) * padWidth));
				
				return (
					<div 
						key={`pad-${index}`}
						className="movement-pad-container" 
						style={{ 
							left: `${padPosition}%`,
							right: 'auto',
							bottom: 0,
							width: `${padWidth}%`
						}}
					>
						<MovementPad 
							value={pos} 
							onChange={(v) => updateCharacterPosition(index, v)} 
						/>
					</div>
				);
			})}
		</div>
	);
}

export default Theater;