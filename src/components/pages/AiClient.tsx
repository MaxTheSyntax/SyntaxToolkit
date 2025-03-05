import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { openDB } from 'idb';
import ollama from 'ollama';
import '../../styles/AiClient.css';

// Define a function to initialize the database and store
async function initializeStore(storeName: string) {
    // Get current version or start with 1
    const existingDB = await openDB('chatDB');
    const version = existingDB ? existingDB.version + 1 : 1;
    existingDB?.close();

    const db = await openDB('chatDB', version, {
        upgrade(db) {
            // Create the store if it doesn't exist
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        }
    });
    return db;
}

function AiClient() {
    const [ollamaModels, setOllamaModels] = useState<
        | {
              name: string;
          }[]
        | null
    >(null);
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selectedModel') || '');
    const [conversationId] = useState(generateRandomId()); // Move to state to keep persistent

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

    async function handleSendMessage() {
        const textbox = document.getElementById('textbox') as HTMLTextAreaElement;
        const message = textbox.value.trim();

        if (!message) return;

        const storeName = `chat-${conversationId}`;

        let db = null;
        try {
            db = await initializeStore(storeName);

            // Check if store exists, if not create it
            if (!db.objectStoreNames.contains(storeName)) {
                db.close();
                // Increment version to trigger upgrade
                const newDb = await openDB('chatDB', db.version + 1, {
                    upgrade(db) {
                        db.createObjectStore(storeName, { autoIncrement: true });
                    }
                });
                db = newDb;
            }

            // Save message to store
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            await store.add({
                role: 'user',
                content: message
            });
            await tx.done;

            textbox.value = '';
        } catch (error) {
            console.error('Failed to save message:', error);
            return;
        }

        // Retrieve all messages from IndexedDB store for conversation
        const tx = db.transaction(storeName, 'readonly');
        const store2 = tx.objectStore(storeName);
        const messages = await store2.getAll();
        await tx.done;

        console.table(messages);

        // Display new user message
        const conversation = document.getElementById('conversation');
        if (conversation) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add('user');
            messageDiv.innerText = message;
            conversation.appendChild(messageDiv);
        }

        // Send conversation to AI
        const response = await ollama.chat({
            model: selectedModel,
            messages: messages
        });
        const completion = response.message.content;

        // Save AI completion to IndexedDB
        try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            await store.add({
                role: 'assistant',
                content: completion
            });
            await tx.done;
        } catch (error) {
            console.error('Failed to save AI completion:', error);
        }

        // Display new completion
        if (conversation) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add('assistant');
            messageDiv.innerHTML = completion;
            conversation.appendChild(messageDiv);
        }
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
                        <button id="send" onClick={handleSendMessage}>
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
