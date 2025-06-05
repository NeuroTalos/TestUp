from datetime import datetime

from pydantic import BaseModel, EmailStr


class EmailSchema(BaseModel):
    email: EmailStr

    class Config:
        from_attributes = True


class EmailVeficitaionCodesSchema(EmailSchema):
    code: int
    expires_at: datetime