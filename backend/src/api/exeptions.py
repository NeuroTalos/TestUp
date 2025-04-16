from datetime import datetime

from fastapi import HTTPException, Request
from authx import AuthX, AuthXConfig

from src.queries.orm import AsyncORM
from src.config import settings


async def check_faculty(faculty_name):
    faculty = await AsyncORM.get_faculty_by_name(faculty_name)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")


async def data_transform(uncorrect_date):
    try:
        formatted_date = datetime.strptime(uncorrect_date, "%d.%m.%Y").date()
        return formatted_date
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте ДД.ММ.ГГГГ.")


config = AuthXConfig()
config.JWT_SECRET_KEY = settings.SECRET_KEY
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]
config.JWT_CSRF_METHODS = ["DELETE", "PATCH"]

security = AuthX(config = config)


async def access_token_check(request: Request):
    # try:
    token_data = await security.access_token_required(request)
    return token_data
    
    # except Exception as e:
    #     raise HTTPException(status_code=401, detail="Unauthorized")
        