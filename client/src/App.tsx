import { useState, useEffect } from 'react'
import { Spinner, Button, Form } from 'react-bootstrap';
import './App.css'

function App() {

  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [checkDownload, setCheckDownload] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Check Download Status
    if (checkDownload) {
      intervalId = setInterval(() => {
        //console.log("Timed Response");
        fetch(`http://localhost:8000/status/${taskId}`,{
          method: 'GET',
          headers: myHeaders      
        })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data.result.download_status);
          if(data.result.download_status){
            setShowDownloadLink(true);
            setCheckDownload(false);
            setIsDownloading(false);
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

    if(url == ""){
      alert("Enter a link");
      return;
    }

    setIsDownloading(true);
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
      setUrl("");
      setTaskId("");
      setFolderId("");
      setCheckDownload(false);
      setIsDownloading(false);
      setShowDownloadLink(false);
  }

  const DownloadLink = () => {
    if(isDownloading) {
      return (
        <div style={Styles.input}>
            <Spinner animation="border" role="status" variant='primary'>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div> 
      )
    } else if(showDownloadLink) {
        return (
            <div style={Styles.input}>
                <Button variant="link" style={{display : "block" }} href={`http://localhost:8000/get_dlp/${folderId}`}>Download Link</Button>
                <Button variant='primary' onClick={resetPage}>Download Again?</Button>
            </div>  
          )
    } else {
        return (
          <div style={Styles.input}>
              <Form.Control name="url" type="text" placeholder='Playlist Link' value={url} onChange={handleUrl}></Form.Control>
              <Button variant="outline-primary" size="sm" onClick={handleSubmit}>Submit</Button>
          </div> 
        )
    }
  }

  return (
    <div style={Styles.root}>
      <DownloadLink/>
      <p>https://www.youtube.com/playlist?list=PLPRWtKgY2MOuMQTifZgo3LWh51AWCImgA</p>
    </div>
  )
}


const Styles: {root: React.CSSProperties, input: React.CSSProperties} = {
  root: {
    width: '100vw',
    height: '100vh',
    position: "relative",
  },
  input: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    height: '5vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
  }
}

export default App
