from fastapi import APIRouter

from src.queries.orm import AsyncORM
from src.schemas.faculties import FacultyGetSchema, FacultyAddSchema


router = APIRouter(
    prefix= "/faculties",
    tags = ["Faculties"],
)


@router.get("")
async def select_faculties_and_majors() -> list[FacultyGetSchema]:
    faculties = await AsyncORM.select_faculties()

    return faculties


@router.post("")
async def add_faculty(faculty: FacultyAddSchema):
    new_faculty = {
        "name" : faculty.name,
    }

    await AsyncORM.insert_faculties([new_faculty])
    return {"ok": True}