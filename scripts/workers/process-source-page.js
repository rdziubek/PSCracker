'use strict';

let sourcePageContent = null;
let fileName = null;
let fileDate = null;
let filePaswd = null;

/**
 * If a file is to be created in a directory in which there already is a file named the same,
 * the OS appends a ' ' character followed by some index to the newly created one
 * (e.g. 'file_name.zip', 'file_name (2).zip', ...); this extracts the original file name.
 */
function validateFilename() {
    postMessage(['Validating filename&hellip;', '', '']);

    return new Promise((resolve) => {
        let temp = fileName;
        if (temp.includes(' ')) {
            const regex = /\s.*(?=\.)/gm;
            const redundantPart = temp.match(regex);
            temp = temp.replace(String(redundantPart), '').trim();
        }
        resolve(temp);
    });
}

/**
 * Looks for the file name and extracts corresponding date.
 */
function findDate() {
    postMessage(['Regexing date&hellip;', '', '']);

    return new Promise((resolve, reject) => {
        const escapedFileName = fileName.replace('.', '\\.');
        let countRegexp = new RegExp(escapedFileName, 'gsm');
        let count = (String(sourcePageContent).match(countRegexp) || []).length;

        if (count > 0) {
            const downloadSection = String(sourcePageContent)
                .match(/(?=<h2> Materiały do pobrania <\/h2>)(.*?)(?=<h2> Archiwum <\/h2>)/gsm);
            const subMatch1Regexp =
                new RegExp('(.*[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9])(.*?)(?=' + escapedFileName + ')', 'gsm');
            const subMatch1 = String(downloadSection)
                .match(subMatch1Regexp);
            const subMatch2 = String(subMatch1)
                .match(/(.*)(.[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9])/gsm);
            const subMatch3 = String(subMatch2)
                .match(/[0-9]?[0-9][.][0-9]?[0-9][.][0-9]?[0-9]?[0-9]?[0-9]+$/gsm);
            resolve(subMatch3);
        } else reject(`'${fileName}'\nnot found in source.`);
    });
}

/**
 * Returns the sum of date's digits with a 'ps_' or 'ps__' prefix
 */
function crackPaswd() {
    postMessage(['Calculating password&hellip;', '', '']);

    return new Promise((resolve) => {
        let sum = 0;
        for (let i = 0; i < fileDate.length; i++) {
            if (fileDate[i] >= '0' && fileDate[i] <= '9') sum += Number(fileDate[i]);
        }
        resolve((fileDate.includes('2020') ? 'ps__' : 'ps_') + sum);
    });
}

onmessage = (e) => {
    let result = [];

    function chainError(err) {
        return Promise.reject(err);
    }

    fileName = e.data[0];
    sourcePageContent = e.data[1];

    validateFilename()
        .then(response => {
            fileName = String(response);
            result.push(fileName);
            return findDate().then(null, chainError);
        }, chainError)
        .then(response => {
            fileDate = String(response);
            result.push(fileDate);
            return crackPaswd().then(null, chainError);
        })
        .then(response => {
            filePaswd = String(response);
            result.push(response);
        })
        .catch(errorMessage => result = [errorMessage, '', ''])
        .finally(() => postMessage(result));
};
