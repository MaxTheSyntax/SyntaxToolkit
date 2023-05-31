import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [games, setGames] = useState<any[]>([]);
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [steamRes, setSteamRes] = useState<{
		map: any;
		game_count: number;
		games: { appid: number; cover: string; title: string; runURL: string }[];
	} | null>(null);

	useEffect(() => {
		async function fetchSteamAPIres() {
			try {
				const APIres = await axios.get('http://localhost:8800/steamapi');
				setSteamRes(APIres.data);

				const coverPromises = APIres.data.games.map((game: { appid: number }) => getCover(game.appid));
				const coverUrls = await Promise.all(coverPromises);
				setCoverUrls(coverUrls);
			} catch (err) {
				console.log(err);
			}
		}

		fetchSteamAPIres();
	}, []);

	async function getCover(appid: number) {
		const url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/hero_capsule.jpg`;
		const tempCover = 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/hero_capsule.jpg';
		try {
			const response = await axios.get(url);
			if (response.status === 404) {
				return tempCover;
			} else {
				return url;
			}
		} catch (error) {
			return tempCover;
		}
	}

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes?.game_count})</h1>
			</center>
			<div className="games">
				{/* Make a div for each game */}
				{steamRes?.games.map((game, index) => (
					<div key={game.appid} className="game">
						<img
							className="gameCover"
							src={coverUrls[index] === 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/hero_capsule.jpg' ? 'https://cdn.cloudflare.steamstatic.com/steam/apps/220/hero_capsule.jpg' : coverUrls[index]}
							alt={`Cover art of ${game.title}`}
						/>
						<form className="playButton" action={`steam://launch/${game.appid}`} method="POST">
							<input key={game.appid} type="submit" value={game.appid} />
						</form>
					</div>
				))}
			</div>
		</div>
	);
}

export default Games;
