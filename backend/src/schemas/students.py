from typing import Optional
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, EmailStr


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

    class Config:
        from_attributes = True


class StudentAddSchema(StudentGetSchema):
    login: str = Field(max_length=40)
    password: str = Field(max_length=255)
    

class StudentSchema(StudentAddSchema):
    id: int
    
    