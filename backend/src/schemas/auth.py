from pydantic import BaseModel, Field


class AuthSchema(BaseModel):
    login: str = Field(max_length=40)
    password: str = Field(max_length=20)

    class Config:
        from_attributes = True