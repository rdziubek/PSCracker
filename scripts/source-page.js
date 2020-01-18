class SourcePage {
    constructor(url) {
        this._url = url;
        this._content = null;

        this.initFetch();
    }

    get content() {
        return this._content;
    }

    isReady() {
        return this._content !== null;
    }

    postInfo(info) {
        document.querySelector('.info').innerHTML = String(info);
    }

    initFetch() {
        const fetchSourcePageWorker = new Worker('scripts/workers/fetch-source-page.js');

        fetchSourcePageWorker.onerror = (e) => this.postInfo(e.message);
        fetchSourcePageWorker.onmessage = (e) => {
            this._content = e.data;
            this.postInfo('Drop the file');
        };

        fetchSourcePageWorker.postMessage(this._url);
    }
}
