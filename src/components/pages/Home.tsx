import '../../styles/Home.css';

function Home() {
    return (
        <div id="home-page">
            <div id="welcome">
                <h1 id="logo">Welcome to Syntax Toolkit!</h1>
                <p className="subtitle" id="logo-subtitle">
                    <i>DEV RELEASE</i>
                </p>
            </div>

            <div id="introduction">
                <div className="left-paragraph">
                    <p className="paragraph-content">
                        Welcome to Syntax Studios! We hope you have a great time using our software. Syntax Studios is a small development team made
                        up of 0.5 people (I procrastinate). We strive to make your daily life easier and happier.
                    </p>
                </div>
                <div className="right-paragraph">
                    <p className="paragraph-content">We were founded in 2021, and we still haven't made one piece of software.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
