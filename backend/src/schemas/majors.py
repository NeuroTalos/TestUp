from pydantic import BaseModel, Field


class MajorGetSchema(BaseModel):
    name: str = Field(max_length=100)

    class Config:
        from_attributes = True


class MajorAddSchema(BaseModel):
    name: str = Field(max_length=100)
    faculty_name: str


class MajorSchema(MajorAddSchema):
    id: int

    class Config:
        from_attributes = True