from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from backend.database import engine, Base, get_db
from backend import models
from backend.models import Bug, User
from backend.schemas import UserCreate, UserLogin, BugCreate
from backend.auth import hash_password, verify_password

app = FastAPI()
Base.metadata.create_all(bind = engine)
app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def serve_frontend():
    return FileResponse("frontend/index.html")

@app.post("/api/bugs")
def create_bug(
        bug_data: BugCreate,
        db: Session = Depends(get_db)
    ):
    bug = Bug (
        title = bug_data.title,
        description = bug_data.description,
        priority = bug_data.priority
    )
    db.add(bug)
    db.commit()
    db.refresh(bug)
    return bug

@app.get("/api/bugs")
def get_bugs(db: Session = Depends(get_db)):
    bugs = db.query(Bug).all()

    return bugs

@app.get("/api/bugs/{bug_id}")
def get_bug(bug_id: int, db: Session = Depends(get_db)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()

    if bug is None:
        return {"error" : "Bug not found"}

    return bug

@app.delete("/api/bugs/{bug_id}")
def delete_bug(bug_id: int, db: Session = Depends(get_db)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()

    if bug is None:
        return {"error": "Bug not found"}

    db.delete(bug)
    db.commit()

    return {"message": "Bug deleted"}

@app.put("/api/bugs/{bug_id}")
def update_bug(
    bug_id: int,
    title: str,
    description: str,
    status: str,
    priority: str,
    db: Session = Depends(get_db)
):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()

    if bug is None:
        return {"error": "Bug not found"}

    bug.title = title
    bug.description = description
    bug.status = status
    bug.priority = priority

    db.commit()
    db.refresh(bug)
    
    return bug

@app.post("/api/bugs/register")
def register_user(
    user_data : UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code = 409,
            detail = "Username already exists"
        )

    hashed_password = hash_password(user_data.password)
    user = User(
        username = user_data.username,
        hashed_password = hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id" : user.id,
        "username" : user.username
    }

@app.post("/api/auth/login")
def login_user(
    user_data : UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == user_data.username
    ).first()

    if user is None:
        raise HTTPException(
            status_code = 404,
            detail = "User not found"
        )

    if not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code = 401,
            detail = "Invalid username or password"
        )

    return{
        "user_id" : user.id,
        "username" : user.username
    }