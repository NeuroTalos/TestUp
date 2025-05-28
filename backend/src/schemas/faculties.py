from typing import Optional

from pydantic import BaseModel, Field

from src.schemas.majors import MajorGetSchema


class FacultyGetSchema(BaseModel):
    name: str = Field(max_length=100)
    majors: Optional[list[MajorGetSchema]]

    class Config:
        from_attributes = True


class FacultyAddSchema(BaseModel):
    name: str = Field(max_length=100)


class FacultySchema(FacultyAddSchema):
    id: int

    class Config:
        from_attributes = True