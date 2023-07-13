import '../styles/Navbar.css';

function Navbar() {
	return (
		<nav>
			<a className="logo" href="/">
				<b>Syntax Toolkit</b>
			</a>
			<div className="nav-links">
				<a href="/games">Steam Games</a>
			</div>
		</nav>
	);
}

export default Navbar;
