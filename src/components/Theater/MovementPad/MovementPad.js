import React, { useEffect, useRef, useState } from 'react';
import './MovementPad.css';

function MovementPad({ value = { x: 0.5, y: 0.5 }, onChange }) {
	const containerRef = useRef(null);
	const knobRef = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	const [dragging, setDragging] = useState(false);
	// ref to mark this instance's active pointer/touch id (allows multitouch)
	// values: null (inactive), number (pointerId / touch identifier), or 'mouse'
	const activeIdRef = useRef(null);

	// measure container size (the container will be sized by CSS)
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const update = () => {
			const rect = container.getBoundingClientRect();
			setSize({ width: rect.width, height: rect.height });
		};

		update();
		let ro;
		if (window.ResizeObserver) {
			ro = new ResizeObserver(update);
			ro.observe(container);
		} else {
			window.addEventListener('resize', update);
		}

		return () => {
			if (ro) ro.disconnect();
			else window.removeEventListener('resize', update);
		};
	}, []);

	// convert value (0..1) to knob position
	const knobLeft = size.width * (value.x || 0);
	const knobTop = size.height * (value.y || 0);

	// Use explicit mouse/touch handlers attached when dragging starts.
	useEffect(() => {
		let removed = false;

		const container = containerRef.current;
		if (!container) return;

		const onMove = (e) => {
			// only handle moves for the active drag id for this instance
			const rect = container.getBoundingClientRect();
			let clientX, clientY;
			if (e.type && e.type.startsWith('pointer')) {
				// pointer events include pointerId
				if (activeIdRef.current == null || e.pointerId !== activeIdRef.current) return;
				clientX = e.clientX;
				clientY = e.clientY;
			} else if (e.touches && e.touches.length) {
				// touch events: find the touch with matching identifier
				const id = activeIdRef.current;
				const touch = Array.from(e.touches).find((t) => t.identifier === id);
				if (!touch) return;
				clientX = touch.clientX;
				clientY = touch.clientY;
			} else {
				// mouse fallback
				if (activeIdRef.current !== 'mouse') return;
				clientX = e.clientX;
				clientY = e.clientY;
			}
			if (clientX == null || clientY == null) return;
			const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
			const y = Math.min(Math.max(0, clientY - rect.top), rect.height);
			const nx = rect.width ? x / rect.width : 0;
			const ny = rect.height ? y / rect.height : 0;
			onChange && onChange({ x: nx, y: ny });
		};

		const onUp = (e) => {
			// only handle the up for the active id
			if (e.type && e.type.startsWith('pointer')) {
				if (activeIdRef.current == null || e.pointerId !== activeIdRef.current) return;
			} else if (e.changedTouches && e.changedTouches.length) {
				const id = activeIdRef.current;
				const touch = Array.from(e.changedTouches).find((t) => t.identifier === id);
				if (!touch) return;
			} else {
				// mouse
				if (activeIdRef.current !== 'mouse') return;
			}
			setDragging(false);
			activeIdRef.current = null;
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
			window.removeEventListener('touchmove', onMove);
			window.removeEventListener('touchend', onUp);
		};

		// startDrag will be attached to the knob element directly via props
		const startDrag = (startEvent) => {
			startEvent.preventDefault();
			setDragging(true);
			console.debug('MovementPad: startDrag', startEvent.type);

			// determine active id for this drag (pointerId, touch identifier, or 'mouse')
			let id = null;
			if (startEvent.pointerId != null) {
				id = startEvent.pointerId;
				if (knobRef.current && knobRef.current.setPointerCapture) {
					try { knobRef.current.setPointerCapture(id); } catch (err) {}
				}
			} else if (startEvent.touches && startEvent.touches[0]) {
				id = startEvent.touches[0].identifier;
			} else {
				id = 'mouse';
			}
			activeIdRef.current = id;

			// add move/up listeners to window (pointer preferred)
			window.addEventListener('pointermove', onMove);
			window.addEventListener('pointerup', onUp);
			// fallback mouse/touch
			window.addEventListener('mousemove', onMove);
			window.addEventListener('mouseup', onUp);
			window.addEventListener('touchmove', onMove, { passive: false });
			window.addEventListener('touchend', onUp);

			// trigger an initial move to capture the starting position
			onMove(startEvent);

			return () => {
				if (removed) return;
				window.removeEventListener('pointermove', onMove);
				window.removeEventListener('pointerup', onUp);
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mouseup', onUp);
				window.removeEventListener('touchmove', onMove);
				window.removeEventListener('touchend', onUp);
			};
		};

		// attach handlers to the knob via ref (safer than re-rendering handlers)
		const knobEl = knobRef.current;
		if (knobEl) {
			if ('onpointerdown' in window) {
				knobEl.addEventListener('pointerdown', startDrag);
			} else {
				knobEl.addEventListener('mousedown', startDrag);
				knobEl.addEventListener('touchstart', startDrag, { passive: false });
			}
		}

		return () => {
			removed = true;
			if (knobEl) {
				if ('onpointerdown' in window) {
					knobEl.removeEventListener('pointerdown', startDrag);
				} else {
					knobEl.removeEventListener('mousedown', startDrag);
					knobEl.removeEventListener('touchstart', startDrag);
				}
			}
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
			window.removeEventListener('touchmove', onMove);
			window.removeEventListener('touchend', onUp);
		};
	}, [size.width, size.height, onChange]);

	return (
		<div className="movement-pad" ref={containerRef}>
			<div className="movement-pad-inner">
				<div
					className={"movement-pad-knob" + (dragging ? ' dragging' : '')}
					ref={knobRef}
					style={{ left: knobLeft + 'px', top: knobTop + 'px' }}
				/>
			</div>
		</div>
	);
}

export default MovementPad;