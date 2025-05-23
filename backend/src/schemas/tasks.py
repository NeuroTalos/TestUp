from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field

from src.schemas.solutions import SolutionsGetSchema


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


class TaskGetSchema(BaseModel):
    id: int
    title: str
    description: str 
    difficulty: Difficulty
    status: Status
    employer_name: str

    solutions: Optional[list[SolutionsGetSchema]]

    class Config:
        from_attributes = True


class TaskListResponseSchema(BaseModel):
    tasks: list[TaskGetSchema]
    total_pages: int
