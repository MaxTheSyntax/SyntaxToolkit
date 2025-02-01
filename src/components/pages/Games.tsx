import React, {useEffect, useRef, useState} from 'react';
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
    const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);
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

    // Check for ellipsis in game titles and adjust font size if necessary
    useEffect(() => {
        // Check all game titles for ellipsis
        steamRes?.games.forEach((_game, index) => {
            const element = textRefs.current[index];
            if (element && hasEllipsis(element)) {
                const optimalSize = findOptimalFontSize(element);
                element.style.fontSize = `${optimalSize}px`;
            }
        });
    }, [steamRes]);

    function getQuery(param: string) {
        const allParams = new URLSearchParams(window.location.search);
        const query = allParams.get(param);

        return query ?? '';
    }

    // Helper function to check if a game's logo is visible
    function checkGameLogo(index: number, appid: number) {
        return logoUrls[index] == `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/logo.png`;
    }

    // Replace handlePlayButtonHover with simpler version
    function handlePlayButtonHover(appid: number, state: boolean) {
        return function () {
            setHoveredAppid(state ? appid : -1);
        };
    }

    // Helper function to check if element has ellipsis
    const hasEllipsis = (element: HTMLElement) => {
        return element.offsetWidth < element.scrollWidth;
    };

    const findOptimalFontSize = (element: HTMLElement, minSize: number = 10, maxSize: number = 40): number => {
        // Initialize binary search boundaries
        let left = minSize;
        let right = maxSize;

        // Binary search to find the largest font size that fits
        while (left <= right) {
            // Calculate the middle point between current min and max
            const mid = Math.floor((left + right) / 2);

            // Try this font size on the element
            element.style.fontSize = `${mid}px`;

            // Check if text overflows at current size
            // offsetWidth: visible width of element
            // scrollWidth: total width needed for content
            if (element.offsetWidth < element.scrollWidth) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        // 'right' contains the largest size
        return right;
    };

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
                            <img className={`fade${hoveredAppid === game.appid ? ' visible' : ''}`} src={'/src/assets/fade.png'} alt="fade" />
                            <h3
                                ref={(el) => (textRefs.current[index] = el)}
                                className={`gameLogoText${gameLogoVisible ? ' invisible' : ' visible'}`}
                                title={game.name}
                            >
                                {game.name}
                            </h3>
                            <img className={`gameLogo${gameLogoVisible ? ' visible' : ' invisible'}`} src={logoUrls[index]} alt={`{game.name}'s cover art`} />
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
