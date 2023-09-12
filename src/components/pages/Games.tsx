import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [playButtonStatus, setPlayButtonStatus] = useState<boolean[]>([]);
	// const [searchQuery, setSearchQuery] = useState<string>(''); (Will probably never use this lol)
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [logoUrls, setLogoUrls] = useState<string[]>([]);
	const [steamRes, setSteamRes] = useState<{
		map: any;
		game_count: number;
		games: { appid: number; cover: string; name: string; runURL: string }[];
	} | null>(null);

	useEffect(() => {
		async function prepareOutsideSources() {
			try {
				const APIres = await axios.get(`http://192.168.179.159:8800/steamapi/${getQuery()}`); //
				const coverPromises = APIres.data.games.map((game: { appid: number }) => getCover(game.appid));
				const coverUrls = await Promise.all(coverPromises);
				setSteamRes(APIres.data);
				setCoverUrls(coverUrls);

				const logoPromises = APIres.data.games.map((game: { appid: number }) => getLogo(game.appid));
				const logoUrls = await Promise.all(logoPromises);
				setLogoUrls(logoUrls);

				setPlayButtonStatus(Array(APIres.data.games.length).fill(false));
			} catch (err) {
				console.log(err);
			}
		}

		async function getCover(appid: number) {
			const url: string = `http://192.168.179.159:8800/getgamecover/?appid=${appid}`;
			const response = await axios.get(url); // returns what image should be used for the covers
			const state = response.data;

			if (state !== 'missing cover!') {
				return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${state}`; // state is library_hero.jpg || header.jpg
			} else {
				return `/src/assets/missingCover.jpg`; // show missingCover.jpg if no cover available
			}
		}

		async function getLogo(appid: number) {
			const url: string = `http://192.168.179.159:8800/getgamelogo/?appid=${appid}`;
			const response = await axios.get(url); // returns what image should be used for the logos
			const state = response.data;

			if (state !== 'invisible.png') {
				return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${state}`; // state is always logo.png if cover available
			} else {
				return `/src/assets/invisible.png`; // show invisible.png if no cover available
			}
		}

		prepareOutsideSources();
	}, []);

	function getQuery() {
		const queryParameters = new URLSearchParams(window.location.search);
		const query = queryParameters.get('search');

		if (query != null) {
			return `?search=${query}`;
		} else {
			return '';
		}
	}

	function checkGameLogo(index: number, appid: number) {
		if (logoUrls[index] == `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`) {
			return true;
		} else {
			return false;
		}
	}

	function handlePlayButtonHover(appid: number, state: boolean) {
		return function (event: React.MouseEvent<HTMLButtonElement>) {
			const updatedStatus = [...playButtonStatus];
			updatedStatus[appid] = state;
			setPlayButtonStatus(updatedStatus);
		};
	}

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes?.game_count})</h1>
			</center>
			<div className="games">
				{/* Make a div for each game */}
				{steamRes?.games.map((game, index) => {
					const gameLogoVisible: boolean = checkGameLogo(index, game.appid);
					// const gameLogoVisible: boolean = false;

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
							/>
							<h3 className="gameLogoText">{gameLogoVisible ? null : game.name}</h3>
							<img
								className="gameLogo"
								src={logoUrls[index]}
							/>
							<img
								className="gameCover"
								src={coverUrls[index]}
								alt={`Cover art of ${game.name}`}
							/>
							<form
								className="gameForm"
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
