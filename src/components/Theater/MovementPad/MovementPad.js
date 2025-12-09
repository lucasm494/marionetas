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

	const safeValue = {
		x: Math.min(1, Math.max(0, value?.x ?? 0.5)),
		y: Math.min(1, Math.max(0, value?.y ?? 0.5))
	};

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
	// compute knob position such that the knob stays fully inside the pad
	const knobSize = knobRef.current ? knobRef.current.offsetWidth : 18;
	const knobHalf = knobSize / 2;
	const knobLeft = (size.width - knobSize) * safeValue.x + knobHalf;
	const knobTop = (size.height - knobSize) * safeValue.y + knobHalf;

	// Use explicit mouse/touch handlers attached when dragging starts.
	useEffect(() => {
		let removed = false;

		const container = containerRef.current;
		if (!container) return;

		const onMove = (e) => {
			// only handle moves for the active drag id for this instance
			const rect = container.getBoundingClientRect();
			let clientX, clientY;
			// get knob size for edge clamping
			const knobW = knobRef.current ? knobRef.current.offsetWidth : 18;
			const knobH = knobRef.current ? knobRef.current.offsetHeight : 18;
			const halfW = knobW / 2;
			const halfH = knobH / 2;
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
			// clamp pointer so knob center stays within [half, rect - half]
			const rawX = clientX - rect.left;
			const rawY = clientY - rect.top;
			const clampX = Math.min(Math.max(halfW, rawX), Math.max(halfW, rect.width - halfW));
			const clampY = Math.min(Math.max(halfH, rawY), Math.max(halfH, rect.height - halfH));
			const nx = rect.width > knobW ? (clampX - halfW) / (rect.width - knobW) : 0;
			const ny = rect.height > knobH ? (clampY - halfH) / (rect.height - knobH) : 0;
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