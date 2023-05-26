import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [games, setGames] = useState<any[]>([]);
	const [missingCover, setMissingCover] = useState<string>('');
	const [steamRes, setSteamRes] = useState<{
		map: any;
		game_count: number;
		games: { appid: number; cover: string; title: string; runURL: string }[];
	} | null>(null);

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
				setMissingCover(getCover());
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

	const NNsteamRes = 'steamRes !== null && steamRes';

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes?.game_count})</h1>
			</center>
			<div className="games">
				{steamRes?.games.map((game) => (
					<div key={game.appid} className="game">
						{game.cover && (
							<img className="gameCover" src={getCover() !== 'missing' ? `src/assets/${game.cover}` : missingCover} alt={`Cover art of ${game.title}`} />
						)}
						<form className="playButton" action={game.runURL} method="POST">
							{steamRes !== null && steamRes.games.map((steamGame) => <input key={game.appid} type="submit" value={steamGame.appid} />)}
						</form>
					</div>
				))}
			</div>
		</div>
	);
}

function getCover() {
	return 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg';
}

export default Games;
