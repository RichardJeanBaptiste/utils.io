from celery import Celery
import yt_dlp
import uuid

celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def download_playlist(url: str):

    folder_id = str(uuid.uuid4())

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": "temp/" + folder_id + "/%(playlist_index)s - %(title)s.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

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
        
    return {"success": "Playlists downloaded successfully"}
