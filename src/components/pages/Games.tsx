import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [playButtonStatus, setPlayButtonStatus] = useState<boolean[]>([]);
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

				setPlayButtonStatus(Array(APIres.data.games.length).fill(false));
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
				await axios.head(url + 'library_hero.jpg');
				return url + 'library_hero.jpg';
			} catch {
				await axios.head(url + 'header.jpg');
				return url + 'header.jpg';
			}
		} catch {
			console.warn(`MISSING COVER for ${appid}`);
			return '/src/assets/missingCover.jpg';
		}
	}

	const handlePlayButtonHover = (appid: number, state: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
		const updatedStatus = [...playButtonStatus]; // Gets the previous state of playButtonStatus
		updatedStatus[appid] = state;
		setPlayButtonStatus(updatedStatus);
	};

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
							className="gameLogo"
							style={{ transform: 'translate(5px, var(--gameHeight))' }}
							src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/logo.png`}
							alt={`${game.name} logo`}
						/>
						<img className="fade" src={'/src/assets/fade.png'} alt={`${game.name} logo`} />
						<img className="gameCover" src={coverUrls[index]} alt={`Cover art of ${game.name}`} />
						<form action={`steam://launch/${game.appid}`} method="POST">
							<button
								type="submit"
								className="btn btn-primary playButton"
								onMouseEnter={handlePlayButtonHover(game.appid, true)}
								onMouseLeave={handlePlayButtonHover(game.appid, false)}
							>
								<svg width="25" viewBox="0 0 460.5 531.74">
									<polygon fill="#ffffff" points="0.5,0.866 459.5,265.87 0.5,530.874 " />
								</svg>
								{playButtonStatus[game.appid] ? (
									<>
										<br /> {game.name}
									</>
								) : null}
							</button>
						</form>
					</div>
				))}
			</div>
		</div>
	);
}

export default Games;
