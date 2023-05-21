import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const STEAM_API_KEY = process.env.STEAM_API_KEY;

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'quickpass',
	database: 'items',
});

app.get('/', (req, res) => {
	res.json('Nothing here!');
});

app.get('/games', (req, res) => {
	const q = 'SELECT * FROM games ORDER BY title;';
	db.query(q, (err, data) => {
		if (err) return res.json(err);
		return res.json(data);
	});
});

app.get('/steamapi', async (req, res) => {
	try {
		const userSteamID = '76561198265061661';
		const q = '/IPlayerService/GetOwnedGames';
		const APIres = await axios.get(`http://api.steampowered.com${q}/v0001/?key=${STEAM_API_KEY}&steamid=${userSteamID}&format=json`);
		// console.log(APIres.data.response);
		return res.json(APIres.data.response);
	} catch (err) {
		res.status(500);
		console.log(err);
		return res.json('API error');
	}
});

app.post('/games', (req, res) => {
	const q = 'INSERT INTO games (`title`, `cover`, `runURL`) VALUES (?)';
	const values = [req.body.title, req.body.cover, req.body.runURL];

	db.query(q, [values], (err, data) => {
		if (err) return res.json(err);
		return res.json(data);
	});
});

app.listen(8800, () => {
	console.log('Connected to server');
});
