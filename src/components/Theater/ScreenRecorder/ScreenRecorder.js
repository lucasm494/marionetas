import React, { useState, useRef, useEffect } from 'react';
import './ScreenRecorder.css';
import html2canvas from 'html2canvas';

const ScreenRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const framesRef = useRef([]);
	const timerRef = useRef(null);
	const captureIntervalRef = useRef(null);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const captureStage = async () => {
		try {
			const stageElement = document.querySelector('.theater-stage');
			if (!stageElement) return null;

			const canvas = await html2canvas(stageElement, {
				backgroundColor: null,
				scale: 0.8,
				useCORS: true,
				logging: false
			});

			return canvas;
		} catch (error) {
			console.error('Erro ao capturar palco:', error);
			return null;
		}
	};

	const startRecording = async () => {
		const stageElement = document.querySelector('.theater-stage');
		if (!stageElement) return;

		setIsRecording(true);
		setRecordingTime(0);
		framesRef.current = [];

		timerRef.current = setInterval(() => {
			setRecordingTime(prev => prev + 1);
		}, 1000);

		captureIntervalRef.current = setInterval(async () => {
			try {
				const canvas = await captureStage();
				if (canvas) {
					canvas.toBlob((blob) => {
						if (blob) {
							framesRef.current.push({
								blob,
								timestamp: Date.now(),
								width: canvas.width,
								height: canvas.height
							});
						}
					}, 'image/jpeg', 0.8);
				}
			} catch (error) {
				console.error('Erro ao capturar frame:', error);
			}
		}, 100);
	};

	const stopRecording = async () => {
		if (!isRecording) return;

		setIsRecording(false);
		
		if (timerRef.current) clearInterval(timerRef.current);
		if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);

		if (framesRef.current.length === 0) return;

		try {
			await createVideoFromFrames();
		} catch (error) {
			console.error('Erro ao criar vídeo:', error);
		}
	};

	const createVideoFromFrames = async () => {
		const firstFrame = framesRef.current[0];
		const width = firstFrame.width;
		const height = firstFrame.height;

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');

		const stream = canvas.captureStream(10);
		const mediaRecorder = new MediaRecorder(stream, {
			mimeType: 'video/webm;codecs=vp8'
		});

		const chunks = [];
		
		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				chunks.push(event.data);
			}
		};

		mediaRecorder.onstop = () => {
			const videoBlob = new Blob(chunks, { type: 'video/webm' });
			const url = URL.createObjectURL(videoBlob);
			
			const a = document.createElement('a');
			a.href = url;
			a.download = `teatro-gravado-${Date.now()}.webm`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			
			setTimeout(() => {
				URL.revokeObjectURL(url);
				framesRef.current = [];
			}, 100);
		};

		mediaRecorder.start();

		let frameIndex = 0;
		
		const processNextFrame = () => {
			if (frameIndex >= framesRef.current.length) {
				mediaRecorder.stop();
				return;
			}

			const frame = framesRef.current[frameIndex];
			const img = new Image();
			
			img.onload = () => {
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);
				frameIndex++;
				setTimeout(processNextFrame, 100);
			};
			
			img.src = URL.createObjectURL(frame.blob);
		};

		processNextFrame();
	};

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
		};
	}, []);

	return (
		<div className="screen-recorder">
			<div className="recorder-controls">
				{!isRecording ? (
					<button 
						className="recorder-btn record-btn"
						onClick={startRecording}
					>
						<span className="recorder-icon">
							<img src="/images/play.png" alt="play Icon" />
						</span>
					</button>
				) : (
					<button 
						className="recorder-btn stop-btn"
						onClick={stopRecording}
					>
						<span className="recorder-icon">
							<img src="/images/pause.png" alt="pause Icon" />
						</span>
					</button>
				)}
			</div>
			
			{isRecording && (
				<div className="recording-info">
					<div className="time-display">
						<span className="time-value">{formatTime(recordingTime)}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScreenRecorder;