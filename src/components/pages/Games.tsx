import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [games, setGames] = useState<any[]>([]);
	const [missingCover, setMissingCover] = useState<string>('');
	const [steamRes, setSteamRes] = useState<{ game_count: number } | null>(null);

	useEffect(() => {
		async function fetchAllGames() {
			try {
				const res = await axios.get('http://localhost:8800/games');
				setGames(res.data);
			} catch (err) {
				console.log(err);
			}
		}

		async function fetchMissingCover() {
			try {
				const coverURL = await getMissingCover();
				setMissingCover(coverURL);
			} catch (err) {
				console.log(err);
			}
		}

		async function fetchSteamAPIres() {
			try {
				const APIres = await axios.get('http://localhost:8800/steamapi');
				setSteamRes(APIres.data);
			} catch (err) {
				console.log(err);
			}
		}

		fetchAllGames();
		fetchMissingCover();
		fetchSteamAPIres();
	}, []);

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes !== null && steamRes.game_count})</h1>
			</center>
			<div className="games">
				{games.map((game) => (
					<div key={game.id} className="game">
						{game.cover && (
							<img className="gameCover" src={game.cover !== 'missing' ? `src/assets/${game.cover}` : missingCover} alt={`Cover art of ${game.title}`} />
						)}
						<form className="playButton" action={game.runURL} method="POST">
							<input type="submit" value="Play" />
						</form>
					</div>
				))}
			</div>
		</div>
	);
}

async function getMissingCover(): Promise<string> {
	return 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg';
}

export default Games;
