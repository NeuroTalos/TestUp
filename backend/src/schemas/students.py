from typing import Optional
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, EmailStr

from src.schemas.solutions import SolutionGetInTasksSchema


class Gender(str, Enum):
    male = "male"
    female = "female"


class StudentGetSchema(BaseModel):
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    middle_name: Optional[str] = None
    date_of_birth: date | str
    email: EmailStr
    phone: str = Field(max_length=11)
    telegram: Optional[str] = Field(default=None, max_length=100)
    gender: Gender
    course: int
    group: str
    
    faculty_name: str
    major_name: str

    ready_solutions: Optional[list[SolutionGetInTasksSchema]] = None

    class Config:
        from_attributes = True


class StudentAddSchema(StudentGetSchema):
    login: str = Field(max_length=40)
    password: str = Field(max_length=20)
    

class StudentSchema(StudentAddSchema):
    id: int
    

class StudentUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None

    class Config:
        from_attributes = True 