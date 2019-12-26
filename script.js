'use strict';

let textInfo = document.querySelector('.info');

let fetchedSourcePage = undefined;
let fileName = null;
let date = null;
let paswd = null;

function fetchSourcePage() {
    let url = 'https://green-darkness-a2a9.witampanstwa.workers.dev/?' +
        encodeURIComponent('https://zse.edu.pl/Siewniak/');

    $.get(url, function (response) {
        fetchedSourcePage = response;   // undefined if not fully downloaded yet
    });
}

function getDate(fileName) {
    // If needed put escape chars in fileName
    fileName = fileName.replace('.', '\\.');

    // Check if the file exists
    let countRegexp = new RegExp(fileName, 'gsm');
    let count = (fetchedSourcePage.match(countRegexp) || []).length;

    if (count > 0) {
        const downloadSection = String(fetchedSourcePage)
            .match(/(?=<h2> Materiały do pobrania <\/h2>)(.*?)(?=<h2> Archiwum <\/h2>)/gsm);
        const subMatch1Regexp =
            new RegExp('(.*[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9])(.*?)(?=' + fileName + ')', 'gsm');
        const subMatch1 = String(downloadSection)
            .match(subMatch1Regexp);
        const subMatch2 = String(subMatch1)
            .match(/(.*)(.[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9])/gsm);
        const subMatch3 = String(subMatch2)
            .match(/[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9]+$/gsm);

        return String(subMatch3);
    }
}

function crackPaswd(date) {
    let sum = 0;
    for (let i = 0; i < date.length; i++) {
        if (date[i] >= '0' && date[i] <= '9') sum += Number(date[i]);
    }

    return 'ps_' + sum;
}

function prepareResources() {
    fetchSourcePage();

    // Wait until target page content is downloaded
    let check = function () {
        if (fetchedSourcePage === undefined) setTimeout(check, 250);
    };

    check();
}

function handleDrop(ev) {
    ev.preventDefault();

    // Compile data
    fileName = ev.dataTransfer.items[0].getAsFile().name;
    date = getDate(fileName);
    paswd = crackPaswd(date);

    textInfo.innerHTML = fileName +
        '\n' + date +
        '\n' + paswd;
}

function handleDrag(ev) {
    ev.preventDefault();
}

document.body.ondrop = () => handleDrop(event);
document.body.ondragover = () => handleDrag(event);

prepareResources();
