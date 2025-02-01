import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { createServer } from 'http'; // Import createServer from 'http'
import { Server } from 'socket.io';
// import { platform } from 'os';

dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
        // origin: 'http://localhost:80', // Frontend origin
        // methods: ['GET', 'POST'],
        // credentials: true,
    })
);

const STEAM_API_KEY = process.env.STEAM_API_KEY;
// const STEAM_ID = process.env.STEAM_ID;

app.get('/', (req, res) => {
    res.send('Nothing here!');
});

app.get('/steamapi', async (req, res) => {
    try {
        const q = '/IPlayerService/GetOwnedGames';
        const additionalArguments = '&include_played_free_games=true&include_appinfo=true';
        const steamId = req.query.user;

        const APIres = await axios.get(
            `https://api.steampowered.com${q}/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json${additionalArguments}`
        );

        if (req.query.search == undefined) {
            return res.json(APIres.data.response);
        } else {
            const searchQuery = req.query.search.toLowerCase();
            const games = APIres.data.response.games;

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
    const { appid, platform } = req.query; // Extract the appid from the query parameters
    if (appid && platform) {
        console.log(appid + platform);
        io.emit('rungame', { platform, appid });
        res.status(200).send('Command sent to clients');
    } else {
        res.status(400).send('No parameters provided');
    }
});

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Frontend origin
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket'] // Force WebSocket transport
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(8800, () => {
    console.log('Connected to server');
});
