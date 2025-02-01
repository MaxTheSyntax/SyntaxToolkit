import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { lazy } from 'react';

// import Home from './pages/Home';
// import Games from './pages/Games';
// import Add from './pages/Add';

const Home = lazy(() => import('./pages/Home'));
const Games = lazy(() => import('./pages/Games'));
const Add = lazy(() => import('./pages/Add'));
const GameLauncher = lazy(() => import('./pages/GameLauncher'));

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/add" element={<Add />} />
                <Route path="/launcher" element={<GameLauncher />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
