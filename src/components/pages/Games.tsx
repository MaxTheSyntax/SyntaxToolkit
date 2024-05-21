import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';
// import dotenv from 'dotenv';
// dotenv.config();

function Games() {
	// State variables to manage data
	const [playButtonStatus, setPlayButtonStatus] = useState<boolean[]>([]);
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [logoUrls, setLogoUrls] = useState<string[]>([]);
	const [steamRes, setSteamRes] = useState<{
		game_count: number;
		games: { appid: number; cover: string; name: string; runURL: string }[];
	} | null>(null);
	const IP = 'localhost'; // TODO Try to get .env working

	useEffect(() => {
		async function prepareOutsideSources() {
			try {
				// Fetch data from an external API
				const APIres = await axios.get(`http://${IP}:8800/steamapi/${getQuery()}`);

				// Fetch cover images for each game
				const coverPromises = APIres.data.games.map((game: { appid: number }) =>
					getCover(game.appid)
				);
				const coverUrls = await Promise.all(coverPromises);
				setSteamRes(APIres.data);
				setCoverUrls(coverUrls);

				// Fetch logo images for each game
				const logoPromises = APIres.data.games.map((game: { appid: number }) => getLogo(game.appid));
				const logoUrls = await Promise.all(logoPromises);
				setLogoUrls(logoUrls);

				// Initialize the play button status
				setPlayButtonStatus(Array(APIres.data.games.length).fill(false));
			} catch (err) {
				console.log(err);
			}
		}

		async function getCover(appid: number) {
			const url: string = `http://${IP}:8800/getgamecover/?appid=${appid}`;
			const response = await axios.get(url);
			const state = response.data;

			if (state !== 'missing cover!') {
				return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${state}`;
			} else {
				return `/src/assets/missingCover.jpg`;
			}
		}

		async function getLogo(appid: number) {
			const url: string = `http://${IP}:8800/getgamelogo/?appid=${appid}`;
			const response = await axios.get(url);
			const state = response.data;

			if (state !== 'logo missing!') {
				return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/${state}`;
			} else {
				return '/src/assets/invisible.png';
			}
		}

		// Call the data preparation function when the component mounts
		prepareOutsideSources();
	}, []);

	// Helper function to extract the 'search' query parameter from the URL
	function getQuery() {
		const queryParameters = new URLSearchParams(window.location.search);
		const query = queryParameters.get('search');

		if (query != null) {
			return `?search=${query}`;
		} else {
			return '';
		}
	}

	// Helper function to check if a game's logo is visible
	function checkGameLogo(index: number, appid: number) {
		if (logoUrls[index] == `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`) {
			return true;
		} else {
			return false;
		}
	}

	// Event handler for hover over play button
	function handlePlayButtonHover(appid: number, state: boolean) {
		return function (event: React.MouseEvent<HTMLButtonElement>) {
			const updatedStatus = [...playButtonStatus];
			updatedStatus[appid] = state;
			setPlayButtonStatus(updatedStatus);
		};
	}

	return (
		<div className='gamesPage'>
			<center>
				<h1 className='title'>Games ({steamRes?.game_count})</h1>
			</center>
			<div className='games'>
				{/* Render a div for each game */}
				{steamRes?.games.map((game, index) => {
					const gameLogoVisible: boolean = checkGameLogo(index, game.appid);

					return (
						<div key={game.appid} className='game'>
							<img
								className={`fade${playButtonStatus[game.appid] ? ' visible' : ''}`}
								src={'/src/assets/fade.png'}
							/>
							<h3 className={`gameLogoText${gameLogoVisible ? ' invisible' : ' visible'}`}>
								{game.name}
							</h3>
							<img className='gameLogo' src={logoUrls[index]} />
							<img
								className='gameCover'
								src={coverUrls[index]}
								alt={`Cover art of ${game.name}`}
							/>
							<form
								className='gameForm'
								action={`steam://launch/${game.appid}`}
								method='POST'
								target='_blank'
								rel='noopener noreferrer'
							>
								<button
									type='submit'
									className='playButton'
									onMouseEnter={handlePlayButtonHover(game.appid, true)}
									onMouseLeave={handlePlayButtonHover(game.appid, false)}
								>
									<svg className='playGraphic' width='25' viewBox='0 0 460.5 531.74'>
										<polygon fill='#ffffff' points='0.5,0.866 459.5,265.87 0.5,530.874' />
									</svg>
									{playButtonStatus[game.appid] ? <>&nbsp; {game.name}</> : null}
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
