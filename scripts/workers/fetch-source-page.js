'use strict';

onmessage = (e) => {
    const url = e.data;
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.onreadystatechange = () => {
        if (xmlHttpRequest.status === 200) postMessage(xmlHttpRequest.responseText);
        else throw new Error('Proxy is down\n(its HTTP status was ' + xmlHttpRequest.status + ').');
    };
    xmlHttpRequest.send();
};
