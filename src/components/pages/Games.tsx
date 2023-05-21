import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import express from 'express';
// import cors from 'cors';
// const app = express();
// app.use(express.json());
// app.use(cors());
import '../../styles/Games.css';

function Games() {
	const [games, setGames] = useState<any[]>([]);
	const [missingCover, setMissingCover] = useState<string>('');

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

		fetchAllGames();
		fetchMissingCover();
	}, []);

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games</h1>
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
	const APIres = await axios.get('http://localhost:8800/steamapi');
	// const numberOfGames = res.json(APIres.data.game_count);

	return 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg';
}

export default Games;
