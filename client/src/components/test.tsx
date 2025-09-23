/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Spinner } from 'react-bootstrap';

const Test = () => {
    const [downloadStart, setDownloadStart ] = useState(false);
    const [isDownloading, setIsDownloading ] = useState(false);
    const [downloadFinished, setDownloadFinished] = useState(false);

    const startDownload = () => {
        setIsDownloading(false);
        setDownloadFinished(true);
    }

    const stopDownload = () => {
        setDownloadStart(false);
        setDownloadFinished(false);
        setIsDownloading(false);
    }

    if(isDownloading) {
        return (
            <div>
                <p onClick={startDownload}>Loading.....</p>
            </div>
        )
    } else if(downloadFinished) {
        return (
            <div>
                <p onClick={stopDownload}>Download Finished....</p>
            </div>
        )
    } else {
        return (
            <div>
                <p onClick={() => setIsDownloading(true)}>Ready To Download</p>
            </div>
        )
    }
}

export default Test;