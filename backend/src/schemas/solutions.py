from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field, EmailStr

from src.schemas.file_links import FileLinksSchema


class StudentGetInTaskSchema(BaseModel):
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    middle_name: Optional[str] = None
    email: EmailStr
    phone: str = Field(max_length=11)
    telegram: Optional[str] = Field(default=None, max_length=100)
    course: int
    group: str
    faculty_name: str
    major_name: str

    class Config:
        from_attributes = True


class SolutionGetInTasksSchema(BaseModel):
    id: int
    solution_description: str 
    employer_comment: Optional[str] = None 
    task_id: int
    student_id: int
    created_at: datetime   

    files: Optional[list[FileLinksSchema]]

    class Config:
        from_attributes = True


class SolutionGetSchema(SolutionGetInTasksSchema):
    student: StudentGetInTaskSchema


class SolutionAddSchema(BaseModel):
    solution_description: str 

    class Config:
        from_attributes = True