import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Games.css';
// import dotenv from 'dotenv';
// dotenv.config();

function Games() {
    // State variables to manage data
    const [hoveredAppid, setHoveredAppid] = useState<number>(-1);
    const [coverUrls, setCoverUrls] = useState<string[]>([]);
    const [logoUrls, setLogoUrls] = useState<string[]>([]);
    const [steamRes, setSteamRes] = useState<{
        game_count: number;
        games: { appid: number; cover: string; name: string; runURL: string }[];
    } | null>(null);
    const IP = 'localhost'; // backend IP

    useEffect(() => {
        async function prepareOutsideSources() {
            try {
                // Fetch data from an external API
                const APIres = await axios.get(
                    `http://${IP}:8800/steamapi/?search=${getQuery('search')}&user=${getQuery('user') || localStorage.getItem('steamUser')}`
                );

                // Fetch cover images for each game
                const coverPromises = APIres.data.games.map((game: { appid: number }) => getCover(game.appid));
                const coverUrls = await Promise.all(coverPromises);
                setSteamRes(APIres.data);
                setCoverUrls(coverUrls);

                // Fetch logo images for each game
                const logoPromises = APIres.data.games.map((game: { appid: number }) => getLogo(game.appid));
                const logoUrls = await Promise.all(logoPromises);
                setLogoUrls(logoUrls);
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

    function getQuery(param: string) {
        const allParams = new URLSearchParams(window.location.search);
        const query = allParams.get(param);

        return query ?? '';
    }

    // Helper function to check if a game's logo is visible
    function checkGameLogo(index: number, appid: number) {
        if (logoUrls[index] == `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`) {
            return true;
        } else {
            return false;
        }
    }

    // Replace handlePlayButtonHover with simpler version
    function handlePlayButtonHover(appid: number, state: boolean) {
        return function (event: React.MouseEvent<HTMLButtonElement>) {
            setHoveredAppid(state ? appid : -1);
        };
    }

    function submitAllForms() {
        // Get the form element from the DOM
        const formElement = document.querySelector('form.userPicker') as HTMLFormElement;
        const form = new FormData(formElement);
        // Create a new FormData object from the form element
        const formData = new FormData(form as unknown as HTMLFormElement); // Create a new FormData object from the form element

        // Create a new URLSearchParams object
        const query = new URLSearchParams();

        // Iterate over each pair in the FormData object and add it to the URLSearchParams object
        for (const pair of formData) {
            // Add the pair to the URLSearchParams object
            query.set(pair[0], pair[1] as string);
        }

        // Get the 'search' query parameter from the URLSearchParams object
        const searchQuery = query.get('search');

        // Log the 'search' query parameter to the console
        console.log(searchQuery);
    }

    return (
        <div className='gamesPage'>
            <center>
                <h1 className='title'>Games ({steamRes?.game_count})</h1>
                {getQuery('search') != '' && (
                    <p className='subtitle'>
                        <i>{`(filtered results for "${getQuery('search')}")`}</i>
                    </p>
                )}
                <form
                    action='/games'
                    className='filterAndUserPickerForm'
                    onSubmit={() => {
                        const userInput = document.querySelector('input[name="user"]') as HTMLInputElement;
                        if (userInput.value) {
                            localStorage.setItem('steamUser', userInput.value);
                        }
                    }}
                >
                    <div className='filters'>
                        <label>
                            Search: <input type='text' name='search' placeholder={getQuery('search')} autoFocus />
                        </label>
                        <label>
                            User:{' '}
                            <input
                                type='text'
                                name='user'
                                placeholder="User's Steam ID"
                                defaultValue={localStorage.getItem('steamUser') || getQuery('user')}
                            />
                        </label>
                    </div>
                    <button type='submit'>Search</button>
                </form>
            </center>
            <div className='games'>
                {/* Render a div for each game */}
                {steamRes?.games.map((game, index) => {
                    const gameLogoVisible: boolean = checkGameLogo(index, game.appid);

                    return (
                        <div key={game.appid} className='game'>
                            <img className={`fade${hoveredAppid === game.appid ? ' visible' : ''}`} src={'/src/assets/fade.png'} />
                            <h3 className={`gameLogoText${gameLogoVisible ? ' invisible' : ' visible'}`}>{game.name}</h3>
                            <img className='gameLogo' src={logoUrls[index]} />
                            <img className='gameCover' src={coverUrls[index]} alt={`Cover art of ${game.name}`} />
                            <form
                                className='gameForm'
                                action={`steam://launch/${game.appid}`}
                                method='POST'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <button
                                    type='submit'
                                    className={`playButton${hoveredAppid === game.appid ? ' playButtonHovered' : ''}`}
                                    onMouseEnter={handlePlayButtonHover(game.appid, true)}
                                    onMouseLeave={handlePlayButtonHover(game.appid, false)}
                                >
                                    <svg className='playGraphic' width='25' viewBox='0 0 460.5 531.74'>
                                        <polygon fill='#ffffff' points='0.5,0.866 459.5,265.87 0.5,530.874' />
                                    </svg>
                                    {hoveredAppid === game.appid ? <>&nbsp; {game.name}</> : null}
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
