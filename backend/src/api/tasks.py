from typing import Annotated

from fastapi import APIRouter, Depends

from src.queries.orm import AsyncORM
from src.schemas.tasks import TaskListResponseSchema, PaginationsParams

router = APIRouter(
    prefix = "/tasks",
    tags = ["Tasks"],
)


PaginationDep = Annotated[PaginationsParams, Depends(PaginationsParams)]


@router.get("")
async def select_tasks(paggination: PaginationDep) -> TaskListResponseSchema:
    offset = (paggination.page - 1) * paggination.limit
    
    tasks, total_count = await AsyncORM.select_tasks(
        limit = paggination.limit,
        offset = offset
    )

    total_pages = (total_count + paggination.limit - 1) // paggination.limit

    return {
        "tasks": tasks,
        "total_pages": total_pages,
    }
