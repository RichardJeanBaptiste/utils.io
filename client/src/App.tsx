/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import './App.css'

/**
 * Clear Selection
 * Style The UI
 */


function App() {

  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [checkDownload, setCheckDownload] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Check Download Status
    if (checkDownload) {
      intervalId = setInterval(() => {
        console.log("Timed Response");
        fetch(`http://localhost:8000/status/${taskId}`,{
          method: 'GET',
          headers: myHeaders      
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.result.download_status);
          if(data.result.download_status){
            setShowDownloadLink(true);
            setCheckDownload(false);
            setShowSpinner(false);
          }
        })
      }, 10000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [checkDownload, taskId]);

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  

  const handleSubmit = async () => {
    setShowSpinner(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json")
    await fetch('http://localhost:8000/dlp',{
            method: 'POST',
            body:JSON.stringify({"name": url}),
            headers: myHeaders,
            })
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
              setTaskId(data.task_id)
              setFolderId(data.folder_id)
              setCheckDownload(true);
            })
  }

  const resetPage = () => {
      console.log("ABC");
      // setUrl("");
      // setTaskId("");
      // setFolderId("");
      // setCheckDownload(false);
      // setShowSpinner(false);
  }

  const DownloadLink = () => {

    if(!showDownloadLink) {
      return (
        <div>
            <input name='url' placeholder='Playlist link' value={url} onChange={handleUrl}/>
            <button onClick={handleSubmit}>Submit</button>
        </div> 
      )
    } else if(showSpinner) {
        return (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    } else {
      return (
              <a style={{display : "block" }} href={`http://localhost:8000/get_dlp/${folderId}`} onClick={resetPage}>Download Link</a>
            )
    }
  }

  return (
    <div>
      <DownloadLink/>
      <button onClick={() => console.log({showSpinner})}>Spinner State</button>

    </div>
  )
}

export default App
