from typing import Optional
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, EmailStr

from src.schemas.solutions import SolutionsGetSchema


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
    gender: Gender
    course: int
    group: str
    
    faculty_name: str
    major_name: str

    ready_solutions: Optional[list[SolutionsGetSchema]]

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
    date_of_birth: Optional[date | str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[Gender] = None
    course: Optional[int] = None
    group: Optional[str] = None
    
    faculty_name: Optional[str]
    major_name: Optional[str]

    class Config:
        from_attributes = True 