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
				{window.location.pathname !== '/' && (
					<form action={window.location.pathname}>
						<label>
							<input
								className='searchBar'
								type='text'
								name='search'
								placeholder={getQuery()}
								autoFocus
							/>
							<span className='material-symbols-outlined'>search</span>
						</label>
					</form>
				)}
				
				
			</div>
		</nav>
	);
}

export default Navbar;
