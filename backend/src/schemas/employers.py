from typing import Optional

from pydantic import BaseModel, Field, EmailStr

from src.schemas.tasks import TaskEmployerGetSchema


class EmployerGetSchema(BaseModel):
    company_name: str = Field(max_length=100)
    email: EmailStr
    phone: str = Field(max_length=11)
    telegram: Optional[str] = Field(default=None, max_length=100)

    tasks: Optional[list[TaskEmployerGetSchema]] = None

    class Config:
        from_attributes = True


class EmployerAddSchema(EmployerGetSchema):
    login: str = Field(max_length=40)
    password: str = Field(max_length=20)


class EmployerSchema(EmployerAddSchema):
    id: int


class EmployerUpdateSchema(BaseModel):
    company_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None

    class Config:
        from_attributes = True 