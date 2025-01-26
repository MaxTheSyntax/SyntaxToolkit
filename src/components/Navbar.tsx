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
            <a className='logo' href='/'>
                <b>Syntax Toolkit</b>
            </a>
            <div className='nav-links'>
                <a href='/games'>Steam Games</a>
                <a href='/launcher'>Game Launcher</a>
            </div>
        </nav>
    );
}

export default Navbar;
