import React from 'react';
import Navbar from './components/Navbar';
import Router from './components/Router';
function App() {
	console.clear(); // Used to remove 3rd party extension errors.
	return (
		<div className="App">
			<Navbar />
			<Router />
		</div>
	);
}

export default App;
