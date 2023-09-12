import '../styles/Navbar.css';

function Navbar() {
	return (
		<nav>
			<a
				className="logo"
				href="/"
			>
				<b>Syntax Toolkit</b>
			</a>
			<div className="nav-links">
				<a href="/games">Steam Games</a>
			</div>
			<div className="gameSearch">
				<form action="/games">
					<input
						className="searchBar"
						type="text"
						name="search"
					/>
				</form>
				<span className="material-symbols-outlined">search</span>
			</div>
		</nav>
	);
}

export default Navbar;
