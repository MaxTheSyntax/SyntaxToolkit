import React from 'react';
import '../../styles/AiClient.css';

function AiClient() {
    return (
        <div className="AiPage">
            <aside>
                <h3>Conversations</h3>
                <div className="conversations">
                    <div>temp</div>
                </div>
                <div className="options">temp options</div>
            </aside>
            <main>
                <h1>AI Client</h1>
                <div id="conversation"></div>
                <div className="inputContainer">
                    {/* TODO: Use what deepseek and chatgpt uses*/}
                    <textarea id="textbox"></textarea>
                    <button id="send">Send</button>
                </div>
            </main>
        </div>
    );
}

export default AiClient;
