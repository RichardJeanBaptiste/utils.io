from fastapi import APIRouter
from pydantic import BaseModel
import hashlib

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

@router.get("/", tags=["users"])
async def users_route():
    return "User Routes"

@router.post("/register")
async def register(user: User):

    sha3_hash = hashlib.sha3_256()
    sha3_hash.update(user.password.encode('utf-8'))
    hashed_password = sha3_hash.hexdigest()
    print(hashed_password)
    return {"register route"}


@router.post("/login")
async def login(user: User):

    try:
        sha3_hash = hashlib.sha3_256()
        sha3_hash.update(user.password.encode('utf-8'))

        login_hash = sha3_hash.hexdigest()

        if(login_hash == "22e829107201c6b975b1dc60b928117916285ceb4aa5c6d7b4b8cc48038083e0"):
            return "Passwords Match"
        else:
            return "Password Incorrect"
    except Exception as e:
        print(e)
        return "Something went wrong while logging in"


    