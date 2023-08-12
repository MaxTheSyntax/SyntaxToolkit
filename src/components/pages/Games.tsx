import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [playButtonStatus, setPlayButtonStatus] = useState<boolean[]>([]);
	// const [searchQuery, setSearchQuery] = useState<string>(''); (Will probably never use this lol)
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [logoExists, setLogoExists] = useState<boolean[]>([]);
	const [steamRes, setSteamRes] = useState<{
		map: any;
		game_count: number;
		games: { appid: number; cover: string; name: string; runURL: string }[];
	} | null>(null);

	const handlePlayButtonHover = (appid: number, state: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
		const updatedStatus = [...playButtonStatus]; // Gets the state of playButtonStatus
		updatedStatus[appid] = state;
		setPlayButtonStatus(updatedStatus);
	};

	useEffect(() => {
		async function prepareOutsideSources() {
			try {
				const APIres = await axios.get('http://localhost:8800/steamapi');
				setSteamRes(APIres.data);

				const coverPromises = APIres.data.games.map((game: { appid: number }) => getCover(game.appid));
				const coverUrls = await Promise.all(coverPromises);
				setCoverUrls(coverUrls);

				setPlayButtonStatus(Array(APIres.data.games.length).fill(false));
				setLogoExists(Array(APIres.data.games.length).fill(false));
			} catch (err) {
				console.log(err);
			}
		}

		// TODO
		// use what you use for covers to get logos

		prepareOutsideSources();
	}, []);

	async function getCover(appid: number) {
		const url: string = `http://localhost:8800/getgamecover/?appid=${appid}`;
		const response = await axios.get(url);
		const state = response.data;

		if (state !== 'missing cover!') {
			return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${state}`; // state is library_hero.jpg || missingCover.jpg
		} else {
			return `/src/assets/missingCover.jpg`; // show missingCover.jpg if no cover available
		}
	}

	const [logoContent, setLogoContent] = useState<JSX.Element | null>(null);

	async function getLogo(appid: number, name: string) {
		try {
			const url: string = `http://localhost:8800/getgamelogo/?appid=${appid}`;
			const response = await axios.get(url);
			const state = response.data;

			if (state !== 'missing logo!') {
				setLogoContent(
					<img
						className="gameLogo"
						src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`}
					/>
				);
			} else {
				setLogoContent(<h2 className="gameLogo">{name}</h2>);
			}
		} catch (error) {
			// console.error('Error loading logo:', error);
		}
	}

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes?.game_count})</h1>
			</center>
			<div className="games">
				{/* Make a div for each game */}
				{steamRes?.games.map((game, index) => {
					// const logoContentPromise = getLogo(game.appid, game.name);

					return (
						<div
							key={game.appid}
							className="game"
						>
							<img
								className={
									`fade${
										playButtonStatus[game.appid] ? ' visible' : ''
									}` /* Decide whether fade.png should be visible */
								}
								src={'/src/assets/fade.png'}
								alt={`${game.name} logo`}
							/>
							{/* {logoContent} */}
							<img
								className="gameCover"
								src={coverUrls[index]}
								alt={`Cover art of ${game.name}`}
							/>
							<form
								action={`steam://launch/${game.appid}`}
								method="POST"
							>
								<button
									type="submit"
									className="playButton"
									onMouseEnter={handlePlayButtonHover(game.appid, true)}
									onMouseLeave={handlePlayButtonHover(game.appid, false)}
								>
									<svg
										className="playGraphic"
										width="25"
										viewBox="0 0 460.5 531.74"
									>
										<polygon
											fill="#ffffff"
											points="0.5,0.866 459.5,265.87 0.5,530.874"
										/>
									</svg>
									{playButtonStatus[game.appid] /* Show game name on button when button is hovered */ ? (
										<>&nbsp; {game.name}</>
									) : null}
								</button>
							</form>
						</div>
					);
				})}
			</div>
		</div>
	);
}
export default Games;
