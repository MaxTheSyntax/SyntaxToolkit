import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

app.get('/', (req, res) => {
	res.send('Nothing here!');
});

app.get('/steamapi', async (req, res) => {
	try {
		const q = '/IPlayerService/GetOwnedGames';
		const additionalArguments = '&include_played_free_games=true&include_appinfo=true';
		const APIres = await axios.get(
			`https://api.steampowered.com${q}/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json${additionalArguments}`
		);

		if (req.query.search == undefined) {
			return res.json(APIres.data.response);
		} else {
			const searchQuery = req.query.search.toLowerCase(); // Convert search query to lowercase for case-insensitive matching
			const games = APIres.data.response.games;

			// Filter games that match the search query
			const filteredGames = games.filter((game) => {
				return game.name.toLowerCase().includes(searchQuery);
			});

			return res.json({ game_count: filteredGames.length, games: filteredGames });
		}
	} catch (err) {
		res.status(500);
		console.log(err);
		return res.json('API error');
	}
});

app.get('/testing', (req, res) => {
	return res.json(req.query.appid);
});

app.get('/getgamecover', async (req, res) => {
	try {
		await axios.head(`https://cdn.cloudflare.steamstatic.com/steam/apps/${req.query.appid}/library_hero.jpg`);
		return res.json('library_hero.jpg');
	} catch {
		try {
			await axios.head(`https://cdn.cloudflare.steamstatic.com/steam/apps/${req.query.appid}/header.jpg`);
			return res.json('header.jpg');
		} catch (err) {
			// console.log(err);
			return res.json('missing cover!');
		}
	}
});

app.get('/getgamelogo', async (req, res) => {
	try {
		await axios.head(`https://cdn.cloudflare.steamstatic.com/steam/apps/${req.query.appid}/logo.png`);
		return res.json('logo.png');
	} catch {
		return res.send('logo missing!');
	}
});

app.get('/rungame', async (req, res) => {
	try {
	} catch {
		return res.send('Invalid APPID!');
	}
});

app.listen(8800, () => {
	console.log('Connected to server');
});
