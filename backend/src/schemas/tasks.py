from typing import Optional
from enum import Enum
from datetime import datetime

from pydantic import BaseModel, Field

from src.schemas.solutions import SolutionGetInTasksSchema
from src.schemas.file_links import FileLinksSchema


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Status(str, Enum):
    active = "active"
    completed = "completed"


class PaginationsParams(BaseModel):
    limit: int = Field(6, ge=0, le=100, description="Кол-во элементов на странице")
    page: int = Field(1, ge=0, description="Номер страницы")


class UnsolvedTaskGetSchema(BaseModel):
    id: int
    title: str
    description: str 
    difficulty: Difficulty
    status: Status
    employer_name: str
    created_at: datetime
    updated_at: datetime

    files: Optional[list[FileLinksSchema]]

    class Config:
        from_attributes = True

class TaskGetSchema(UnsolvedTaskGetSchema):
    
    solutions: Optional[list[SolutionGetInTasksSchema]]

    
class TaskListResponseSchema(BaseModel):
    tasks: list[UnsolvedTaskGetSchema | TaskGetSchema]
    total_pages: int


class TeskAddSchema(BaseModel):
    title: str
    description: str 
    difficulty: Difficulty = Field(default = "easy")

    class Config:
        from_attributes = True