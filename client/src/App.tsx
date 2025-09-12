import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [checkDownload, setCheckDownload] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState("none");

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
            setShowDownloadLink("block")
            setCheckDownload(false);
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

  return (
    <div>
      <p>{taskId}</p>
      <p>Link - {`http://localhost:8000/get_dlp/${folderId}`}</p>
      <a style={{display : showDownloadLink }} href={`http://localhost:8000/get_dlp/${folderId}`}>Download Link</a>
      <label htmlFor='url'></label>
      <input name='url' placeholder='Playlist link' value={url} onChange={handleUrl}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
