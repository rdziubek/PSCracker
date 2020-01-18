'use strict';

const textInfo = document.querySelector('.info');

const sourceUrl = 'https://green-darkness-a2a9.witampanstwa.workers.dev/?' +
    encodeURIComponent('https://zse.edu.pl/Siewniak/');
const sourcePage = new SourcePage(sourceUrl);
const processSourcePageWorker = new Worker('scripts/workers/process-source-page.js');

function setInfo(infoString) {
    textInfo.innerHTML = String(infoString);
}

function handleDrop(ev) {
    ev.preventDefault();

    if (sourcePage.isReady()) {
        let fileName = ev.dataTransfer.items[0].getAsFile().name;
        processSourcePageWorker.postMessage([fileName, sourcePage.content]);
    } else setInfo('Source not fetched yet&hellip;');
}

function handleDrag(ev) {
    ev.preventDefault();
}

document.body.ondrop = () => handleDrop(event);
document.body.ondragover = () => handleDrag(event);
processSourcePageWorker.onerror = (e) => setInfo(e);
processSourcePageWorker.onmessage = (e) => {
    setInfo(
        e.data[0] +
        '\n' + e.data[1] +
        '\n' + e.data[2]
    );
};
