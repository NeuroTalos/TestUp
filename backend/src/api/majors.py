from fastapi import APIRouter

from src.queries.orm import AsyncORM
from src.schemas.majors import MajorAddSchema
from src.api.functions import check_faculty


router = APIRouter(
    prefix = "/majors",
    tags = ["Majors"],
)


@router.post("")
async def add_major(major: MajorAddSchema):
    await check_faculty(major.faculty_name)

    new_major = {
        "name" : major.name,
        "faculty_name": major.faculty_name
    }

    await AsyncORM.insert_majors([new_major])
    return {"ok": True}