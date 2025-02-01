import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../../styles/GameLauncher.css';

function GameLauncher() {
    const [gameAppId, setGameAppId] = useState<string | null>(null);
    const [platform, setPlatform] = useState<string | null>(null);

    useEffect(() => {
        const socket = io('http://localhost:8800', {
            withCredentials: true,
            transports: ['websocket'] // Force WebSocket transport
        });

        socket.on('rungame', (data: { appid: string; platform: string }) => {
            const { appid, platform } = data;
            console.log(`platform: ${platform}, appid: ${appid}`);
            if (appid && platform) {
                if (platform === 'steam') {
                    window.location.href = `steam://launch/${appid}`;
                } else if (platform === 'roblox') {
                    window.location.href = `roblox://placeId=${appid}`;
                }
                setGameAppId(appid);
                setPlatform(platform);
                addActionToDiv(appid, platform);
            }
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    function addActionToDiv(appid: string, platform: string) {
        const actionContainer = document.getElementsByClassName('action-container')[0];
        if (actionContainer) {
            actionContainer.innerHTML += `<p>Opened ${appid} on ${platform}</p>`;
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Remote App Opener</h1>
                <p className="subtitle">This is supposed to be used together with the Discord bot to remotely launch games.</p>
                {!gameAppId && <p className="listen-text">Listening for commands...</p>}
                {gameAppId && (
                    <p className="last-action">
                        Last action: Opened {gameAppId} on {platform}
                    </p>
                )}
                <div className="action-container">
                    {/* {actions.map((element, index) => (
						<p key={index}>Opened {element}</p>
					))} */}
                </div>
            </header>
        </div>
    );
}

export default GameLauncher;
