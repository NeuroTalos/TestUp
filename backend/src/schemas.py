from typing import Optional
from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, EmailStr


class Gender(str, Enum):
    male = "male"
    female = "female"


class StudentAddSchema(BaseModel):
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    middle_name: Optional[str] = None
    date_of_birth: date
    email: EmailStr
    phone: str = Field(max_length=11)
    gender: Gender
    cours: int
    
    faculty_id: int
    major_id: int


class StudentSchema(StudentAddSchema):
    id: int
    
    class Config:
        from_attributes = True


class MajorAddSchema(BaseModel):
    name: str = Field(max_length=100)

    faculty_id: int


class MajorSchema(MajorAddSchema):
    id: int

    class Config:
        from_attributes = True


class FacultyAddSchema(BaseModel):
    name: str = Field(max_length=100)
    majors: Optional[list[MajorSchema]]


class FacultySchema(FacultyAddSchema):
    id: int

    class Config:
        from_attributes = True