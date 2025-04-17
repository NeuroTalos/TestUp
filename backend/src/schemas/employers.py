from typing import Optional

from pydantic import BaseModel, Field, EmailStr

from src.schemas.tasks import TaskEmployerGetSchema


class EmployerGetSchema(BaseModel):
    company_name: str = Field(max_length=100)
    email: EmailStr
    phone: str = Field(max_length=11)

    tasks: Optional[list[TaskEmployerGetSchema]]

    class Config:
        from_attributes = True