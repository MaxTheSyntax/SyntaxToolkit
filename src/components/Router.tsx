import { Route, BrowserRouter, Routes } from 'react-router-dom';
import React from 'react';
import Main from './pages/Main';
import Games from './pages/Games';
import Add from './pages/Add';

function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/games" element={<Games />} />
				<Route path="/add" element={<Add />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
