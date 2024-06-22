import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function GameLauncher() {
	const [gameAppId, setGameAppId] = useState<string | null>(null);

	useEffect(() => {
		const socket = io('http://localhost:8800', {
			withCredentials: true,
			transports: ['websocket'], // Force WebSocket transport
		});

		socket.on('rungame', (data: { appid: string; platform: string }) => {
			const { appid, platform } = data;
			console.log(`platform: ${platform}, appid: ${appid}`);
			if (appid) {
				if (platform === 'steam') {
					setGameAppId(appid);
					window.location.href = `steam://launch/${appid}`;
				} else if (platform === 'roblox') {
					setGameAppId(appid);
					window.location.href = `roblox://placeId=${appid}`;
				}
			}
		});

		// Cleanup on component unmount
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className='App'>
			<header className='App-header'>
				<h1>Remote App Opener</h1>
				<p>Listening for commands...</p>
				{gameAppId && <p>Opening {gameAppId}...</p>}
			</header>
		</div>
	);
}

export default GameLauncher;
