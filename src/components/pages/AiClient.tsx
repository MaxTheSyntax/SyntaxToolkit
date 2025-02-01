import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AiClient.css';

function AiClient() {
    const [ollamaModels, setOllamaModels] = useState<
        | {
              name: string;
          }[]
        | null
    >(null);
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selectedModel') || '');

    useEffect(() => {
        async function fetchModels() {
            try {
                const APIres = await axios.get(`http://localhost:11434/api/tags`);
                setOllamaModels(APIres.data.models);
                // console.table(APIres.data.models);
            } catch (err) {
                console.error('ERROR WHILE FETCHING AI MODELS: \n' + err);
            }
        }

        fetchModels();
    }, []);

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
                    <textarea id="textbox" placeholder="Ask away!"></textarea>
                    <div className="options">
                        <button id="send">Send</button>
                        <select
                            id="modelSelect"
                            value={selectedModel || (ollamaModels && ollamaModels[0]?.name) || ''}
                            onChange={(e) => {
                                setSelectedModel(e.target.value);
                                localStorage.setItem('selectedModel', e.target.value);
                            }}
                        >
                            {ollamaModels &&
                                ollamaModels.map((model: { name: string }) => (
                                    <option key={model.name} value={model.name}>
                                        {model.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AiClient;
