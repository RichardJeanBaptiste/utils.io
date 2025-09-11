from typing import Union
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from celery.result import AsyncResult
from bg_tasks import celery_app, download_playlist, delete_folder_10mins, delay_task, alert_server
from dotenv import load_dotenv
import os
import shutil

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str


@app.get("/")
def read_root():
    return {"Hello": "Worlds Nigga"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/status/{task_id}")
def get_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }

@app.get("/delay")
def delayed_route():
    '''
        Alert Server
    '''
    delay_task.apply_async(link=alert_server.s())
    return {"message": "Server Alert"}


@app.get("/get_dlp/{folder_id}")
def get_folder(folder_id: str):
    '''
        check if folder exists
        return folder
        auto delete folder after 10 mins
    '''

    folder_path = os.path.join("temp", folder_id)
    zip_path = os.path.join("temp",f"{folder_id}.zip")

    if(os.path.isdir(folder_path)):
        
        shutil.make_archive(base_name=zip_path.replace('.zip',''), format='zip', root_dir=folder_path)
        
        # Set timer to delete after downloading
        delete_folder_10mins.apply_async(args=(folder_path, zip_path),countdown=360)
        return FileResponse(zip_path, media_type="application/zip", filename=f"{folder_id}.zip")
    else:
        return {"folder_id": folder_id, "exists": False}


@app.post("/dlp")
async def get_playlist(item: Item, background_tasks: BackgroundTasks):
    # Validate Url
    # Check if private
    # Create Thread

    task = download_playlist.apply_async(args=(item.name,), link=alert_server.s())
    return {"task_id": task.id, "status": "submitted"}

