from datetime import datetime

from fastapi import HTTPException

from src.queries.orm import AsyncORM


async def check_faculty(faculty_name):
    faculty = await AsyncORM.get_faculty_by_name(faculty_name)
    if not faculty:
        raise HTTPException(status_code=404, detail="Факультет не найден")


async def data_transform(uncorrect_date):
    try:
        formatted_date = datetime.strptime(uncorrect_date, "%d.%m.%Y").date()
        return formatted_date
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте ДД.ММ.ГГГГ.")  