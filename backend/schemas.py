from pydantic import BaseModel

class BugCreate(BaseModel):
    title: str
    description: str
    priority : str