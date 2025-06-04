from pydantic import BaseModel, EmailStr


class PasswordResetSchema(BaseModel):
    email: EmailStr