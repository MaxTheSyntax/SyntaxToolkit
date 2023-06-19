import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [steamRes, setSteamRes] = useState<{
		map: any;
		game_count: number;
		games: { appid: number; cover: string; name: string; runURL: string }[];
	} | null>(null);

	useEffect(() => {
		async function fetchSteamAPIres() {
			try {
				const APIres = await axios.get('http://localhost:8800/steamapi');
				setSteamRes(APIres.data);

				const coverPromises = APIres.data.games.map((game: { appid: number }) => getCover(game.appid));
				const coverUrls = await Promise.all(coverPromises);
				setCoverUrls(coverUrls);

				// const filteredGames = steamRes?.games.filter((game) => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
				// console.log(filteredGames);
			} catch (err) {
				console.log(err);
			}
		}

		fetchSteamAPIres();
	}, []);

	async function getCover(appid: number) {
		const url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/`;
		try {
			try {
				await axios.get(url + 'hero_capsule.jpg');
				return url + 'hero_capsule.jpg';
			} catch {
				return url + 'header.jpg';
			}
		} catch (err) {
			// console.log(err);
			return '/src/assets/missingCover.jpg';
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
						<img className="gameCover" src={coverUrls[index]} alt={`Cover art of ${game.name}`} />
						<form className="playButton" action={`steam://launch/${game.appid}`} method="POST">
							<input key={game.appid} type="submit" value={`Play ${game.name} (${game.appid})`} />
						</form>
					</div>
				))}
			</div>
		</div>
	);
}

export default Games;
