from fastapi import APIRouter

from src.queries.orm import AsyncORM
from src.schemas.employers import EmployerGetSchema

router = APIRouter(
    prefix = "/employers",
    tags = ["Employers"],
)


@router.get("")
async def select_employers() -> list[EmployerGetSchema]:
    students = await AsyncORM.select_employers()

    return students