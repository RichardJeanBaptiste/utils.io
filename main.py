from typing import Union
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from celery.result import AsyncResult
from bg_tasks import download_playlist, celery_app


app = FastAPI()

class Item(BaseModel):
    name: str


@app.get("/")
def read_root():
    return {"Hello": "Worlds Nigga"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


def write_tasks():
    with open('info.txt', 'w') as file:
        file.write('This is a background task example.')



@app.post("/dlp")
async def get_playlist(item: Item, background_tasks: BackgroundTasks):
    # Validate Url
    # Check if private
    # Create Thread

    #playlist_url = "https://www.youtube.com/playlist?list=PLPRWtKgY2MOuMQTifZgo3LWh51AWCImgA"

    task = download_playlist.delay(item.name)
    return {"task_id": task.id, "status": "submitted"}
        
    #return {"message": "Download started in the background."}

@app.get("/status/{task_id}")
def get_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }