console.log("app.js");

import {micromark} from 'https://esm.sh/micromark@3?bundle'

window.addEventListener('load', init);

const userId = crypto.randomUUID();

function init() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', chatResponse);
    localStorage.setItem('user', 'Thomas')
    console.log("Init finished");
}


async function chatResponse(e) {
    e.preventDefault();


    const input = document.getElementById('prompt');

    const message = input.value.trim();
    console.log(message)
    if (!message) return;

    addMessage(message, null, null, "user");
    input.value = "";
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({prompt: message, userId: userId})
    });

    const data = await response.json();


    addMessage(data.response, data.toolUsed, data.source, "bot");
    console.log(data)
}

function addMessage(text, tools, source, sender) {

    const chat = document.querySelector('.chat');
    const bubble = document.createElement('div');

    bubble.classList.add('bubble', sender);

    if (text) {
        const p = document.createElement('div');
        console.log(micromark(text))
        p.innerHTML = micromark(text);
        bubble.appendChild(p);
    }

    if (tools) {
        for (let item in tools) {
            const p = document.createElement('p');
            p.innerHTML = tools[item];
            bubble.appendChild(p);
        }
    }
    console.log(tools)
    console.log(source)
    if (source) {
        for (let item in source) {

            const p = document.createElement('p');
            p.innerHTML = source[item];
            bubble.appendChild(p);
        }
    }


    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
}