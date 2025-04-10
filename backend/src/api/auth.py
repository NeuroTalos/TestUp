from fastapi import APIRouter, HTTPException

from src.queries.orm import AsyncORM
from src.schemas.auth import AuthSchema

router = APIRouter(
    prefix= "/auth",
    tags = ["Authorization"],
)

@router.post("")
async def check_student_data(data: AuthSchema):
    is_valid = await AsyncORM.check_password(data.login, data.password)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    return {"Успешная авторизация": True}