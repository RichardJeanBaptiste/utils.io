from celery import Celery
import yt_dlp
import shutil
import time 

celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def alert_server(task_id):
    time.sleep(10)
    return {"message": f"{task_id} - ready to download"}

@celery_app.task
def download_playlist(url: str, folder_id : str):

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": "temp/" + folder_id + "/%(playlist_index)s - %(title)s.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        error_msg = str(e)
        if "certificate verify failed: unable to get local issuer certificate" in error_msg:
            print(error_msg)
            return {"ERROR": "Certificate verification failed. Please check your SSL certificates."}
        elif isinstance(e, yt_dlp.utils.DownloadError):
            print(error_msg)
            return {"ERROR": "%(x)s is not a valid url"}
        else:
            print(error_msg)
            return {"ERROR": "Something went wrong :("}
        
    return folder_id


@celery_app.task
def delete_folder_10mins(folder_path: str, zip_path: str):

    try:
        shutil.rmtree(folder_path)
        shutil.os.remove(zip_path)
        return {"folder": folder_path, "Deleted": True }
    except Exception as e:
        if(isinstance(e, FileNotFoundError)):
            return {"folder": folder_path, "Deleted": False, "Message": "File Not Found"}
        else:
            print(e)
            return {"Message": "Something Went Wrong", "Error": str(e)}

    
