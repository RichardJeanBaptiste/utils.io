from celery import Celery
import yt_dlp

celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def download_playlist(url: str):
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": "%(playlist_index)s - %(title)s.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # try:
        
    # except Exception as e:
    #     if Exception == yt_dlp.utils.DownloadError:
    #         return {"ERROR" : "%(x)s is not a valid url"}
    #     else:
    #         print(e)
    #         return {"ERROR": "Something went wrong :("}
