from typing import Union
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from celery.result import AsyncResult
from bg_tasks import download_playlist, celery_app
import os
import shutil


app = FastAPI()

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
    print(task_result)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }

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
        
        return FileResponse(zip_path, media_type="application/zip", filename=f"{folder_id}.zip")
        #return {"folder_id": folder_id, "exists": True}
    else:
        return {"folder_id": folder_id, "exists": False}


@app.post("/dlp")
async def get_playlist(item: Item, background_tasks: BackgroundTasks):
    # Validate Url
    # Check if private
    # Create Thread

    task = download_playlist.delay(item.name)
    return {"task_id": task.id, "status": "submitted"}

