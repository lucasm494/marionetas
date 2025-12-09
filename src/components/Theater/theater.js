import React, { useEffect, useRef, useState } from 'react';
import './theater.css';
import ReturnButton from '../common/ReturnButton/ReturnButton';
import MovementPad from './MovementPad/MovementPad';
import images from '../../data/images';

// Keep every character and pad within the visible stage/pad area
const clamp01 = (value, fallback = 0.5) => {
	const num = Number.isFinite(value) ? value : fallback;
	return Math.min(1, Math.max(0, num));
};

const getDefaultPosition = (index) => {
	// Spread characters across columns and move to new rows as needed
	const columns = [0.2, 0.4, 0.6, 0.8];
	const col = index % columns.length;
	const row = Math.floor(index / columns.length);
	const y = Math.min(0.55 + row * 0.18, 0.9); // avoid going off-screen vertically
	return { x: columns[col], y };
};

const normalizePosition = (pos, index) => {
	if (!pos) return getDefaultPosition(index);
	return {
		x: clamp01(pos.x, getDefaultPosition(index).x),
		y: clamp01(pos.y, getDefaultPosition(index).y)
	};
};

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
				const parsed = raw ? JSON.parse(raw) : null;
				positions.push(normalizePosition(parsed, i));
			} catch (err) {
				positions.push(getDefaultPosition(i));
			}
		}
		return positions;
	});

	// Ensure positions array stays in sync with the number of characters
	useEffect(() => {
		setCharacterPositions((prev) => {
			const next = characters.map((_, i) => normalizePosition(prev[i], i));
			return next;
		});
	}, [characters.length]);

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
			updated[index] = normalizePosition(newPos, index);
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

		{/* Movement pads for each character */}
		{characters.map((character, index) => {
			const pos = characterPositions[index] || { x: 0.5, y: 0.5 };
			// Each pad is 1/8th of screen width (12.5%)
			// Alternate left/right: index 0 = left, index 1 = right, index 2 = left, etc.
			const isLeft = index % 2 === 0;
			const padWidth = 12.5; // 1/8th of 100%
		const padPosition = isLeft
			? (Math.floor(index / 2) * padWidth) // Left side positions: 0%, 12.5%, 25%, etc.
			: (100 - ((Math.floor(index / 2) + 1) * padWidth)); // Right side positions: 87.5%, 75%, etc.
			
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