import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';

function Games() {
	const [playButtonStatus, setPlayButtonStatus] = useState<boolean[]>([]);
	// const [searchQuery, setSearchQuery] = useState<string>('');
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

		prepareOutsideSources();
	}, []);

	async function getCover(appid: number) {
		const url: string = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/`;
		try {
			try {
				await axios.head(url + 'library_hero.jpg'); // Will fail if library_hero.jpg is missing
				return url + 'library_hero.jpg';
			} catch {
				await axios.head(url + 'header.jpg'); // same as library_hero.jpg
				return url + 'header.jpg';
			}
		} catch {
			console.warn(`MISSING COVER for ${appid}`);
			return '/src/assets/missingCover.jpg';
		}
	}

	/* async function getGameLogo(appid: number) {
		const updatedStatus = [...playButtonStatus]; // Gets the state of playButtonStatus
		updatedStatus[appid] = await logoOrTitle(appid);
		setLogoExists(updatedStatus);
	}

	async function logoOrTitle(appid: number) {
		const url: string = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`;
		try {
			await axios.head(url);
			return true;
		} catch {
			return false;
		}
	}

	function logoRenderer(appid: number, gameName: string) {
		if (logoExists[appid] === true) {
			return (
				<img
					className="gameLogo"
					style={{ transform: `translate(5px, 5px)` }}
					src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`}
					alt={`${gameName} logo`}
				/>
			);
		} else {
			console.log('IT WORKS!!!!!');
			return <p>MISSINGSGGSGS</p>;
		}
	} */

	return (
		<div className="gamesPage">
			<center>
				<h1 className="title">Games ({steamRes?.game_count})</h1>
			</center>
			<div className="games">
				{/* Make a div for each game */}
				{steamRes?.games.map((game, index) => (
					<div
						key={game.appid}
						className="game"
					>
						{/* {getGameLogo(game.appid)} */}
						{/* {logoRenderer(game.appid, game.name)} */}
						<img
							className={
								`fade${playButtonStatus[game.appid] ? ' visible' : ''}` /* Decide whether fade.png should be visible */
							}
							src={'/src/assets/fade.png'}
							alt={`${game.name} logo`}
						/>
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
				))}
			</div>
		</div>
	);
}
export default Games;
