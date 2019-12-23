'use strict';

let textInfo = document.querySelector('.info');

function fetchDate() {
    return undefined;
}

function crackPaswd() {
    return undefined;
}

function handleDrop(ev) {
    ev.preventDefault();

    let fileName = ev.dataTransfer.items[0].getAsFile().name;

    textInfo.innerHTML = fileName +
        '\n' + fetchDate(fileName) +
        '\n' + crackPaswd(fileName);
}

function handleDrag(ev) {
    ev.preventDefault();
}

document.body.ondrop = () => handleDrop(event);
document.body.ondragover = () => handleDrag(event);