import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { openDB } from 'idb';
import '../../styles/AiClient.css';

function AiClient() {
    const [ollamaModels, setOllamaModels] = useState<
        | {
              name: string;
          }[]
        | null
    >(null);
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selectedModel') || '');
    let conversationId = generateRandomId();

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

    function toggleModelsDisplay() {
        const modelsDiv = document.getElementById('modelList');
        if (modelsDiv) {
            if (modelsDiv.style.visibility == 'visible') {
                modelsDiv.style.opacity = '0';
                modelsDiv.style.visibility = 'hidden';
            } else {
                modelsDiv.style.opacity = '1';
                modelsDiv.style.visibility = 'visible';
            }
        }
    }

    function generateRandomId(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

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
                        <button
                            id="send"
                            onClick={async () => {
                                const textbox = document.getElementById('textbox') as HTMLTextAreaElement;
                                const message = textbox.value.trim();

                                if (!message) return;

                                const db = await openDB('chatDB', 1, {
                                    upgrade(db) {
                                        if (!db.objectStoreNames.contains(`chat-${conversationId}`)) {
                                            db.createObjectStore(conversationId, { autoIncrement: true });
                                        }
                                    }
                                });

                                await db.add('messages', {
                                    role: 'user',
                                    content: message
                                });

                                textbox.value = '';
                            }}
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                        <button className="modelSelect" onClick={toggleModelsDisplay}>
                            <div className="modelText">
                                {selectedModel ? (
                                    <>
                                        <span>{selectedModel.split(':')[0]}</span>
                                        <span className="modelSize">{selectedModel.split(':')[1]}</span>
                                    </>
                                ) : (
                                    <span>Select Model</span>
                                )}
                            </div>
                        </button>
                        <div id="modelList">
                            {ollamaModels &&
                                ollamaModels.map((model) => {
                                    const splitString = model.name.split(':');
                                    const modelName = splitString[0];
                                    const modelSize = splitString[1];

                                    return (
                                        <button
                                            className="model"
                                            key={model.name}
                                            onClick={() => {
                                                setSelectedModel(model.name);
                                                localStorage.setItem('selectedModel', model.name);
                                            }}
                                        >
                                            <div className="modelText">
                                                <span>{modelName}</span> <span className="modelSize">{modelSize}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AiClient;
