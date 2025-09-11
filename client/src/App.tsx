import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [url, setUrl] = useState("");
  //const [taskId, setTaskId] = useState("");

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
          })
  }

  return (
    <div>
      <label htmlFor='url'></label>
      <input name='url' placeholder='Playlist link' value={url} onChange={handleUrl}/>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
