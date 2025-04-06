from fastapi import HTTPException

from src.queries.orm import AsyncORM

async def check_faculty(faculty_name):
    faculty = await AsyncORM.get_faculty_by_name(faculty_name)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")