import '../styles/Navbar.css';

function Navbar() {
	function getQuery() {
		const queryParameters = new URLSearchParams(window.location.search);
		const query = queryParameters.get('search');

		if (query != null) {
			return query;
		} else {
			return '';
		}
	}

	return (
		<nav>
			<a
				className='logo'
				href='/'
			>
				<b>Syntax Toolkit</b>
			</a>
			<div className='nav-links'>
				<a href='/games'>Steam Games</a>
			</div>
			<div className='gameSearch'>
				<form action='/games'>
					<input
						className='searchBar'
						type='text'
						name='search'
						placeholder={getQuery()}
						autoFocus
					/>
				</form>
				<span className='material-symbols-outlined'>search</span>
			</div>
		</nav>
	);
}

export default Navbar;
