from math import ceil

from fastapi import APIRouter, Depends, Request, HTTPException

from src.queries.orm import AsyncORM
from src.schemas.solutions import SolutionAddSchema
from src.schemas.tasks import PaginationsParams
from src.api.auth import access_token_check, current_role

router = APIRouter(
    prefix = "/solutions",
    tags = ["Solutions"],
)


@router.get("/task_solutions/{task_id}")
async def select_solutions(
    task_id: int,
    request: Request,
    pagination: PaginationsParams = Depends(),
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "employer":
        task_solutions = await AsyncORM.select_task_solutions(task_id)

        if task_solutions:

            total_tasks = len(task_solutions)
            total_pages = ceil(total_tasks / pagination.limit) if pagination.limit > 0 else 1

            start = (pagination.page - 1) * pagination.limit
            end = start + pagination.limit
            paged_tasks = task_solutions[start:end]

            return {
                "solutions": paged_tasks,
                "total_pages": total_pages
            } 
        
        else:
            return {
                "solutions": [],
                "total_pages": 0
            } 

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
    

@router.post("/add/{task_id}")
async def add_solution(
    solution: SolutionAddSchema,
    task_id: int,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        new_solution = {
            "solution_description": solution.solution_description,
            "task_id": task_id,
            "student_id": student_id
        }

        solution_id = await AsyncORM.insert_one_solution([new_solution])

        return {"ok": True, "solution_id": solution_id}

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")  


@router.get("/check_student_solution/{task_id}")
async def select_solution_if_exist(
    task_id: int,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        solution = await AsyncORM.select_solution_if_exist(task_id, student_id)

        if solution:
            return {"solution": solution}
        else:
            return {"message": "Решение не найдено"}

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли") 


@router.patch("/upload_solution_comment/{solution_id}")
async def upload_solution_comment(
    solution_id: int,
    employer_comment: str,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)
    # b=1
    if role == "employer":
        await AsyncORM.update_solution_comment(solution_id, employer_comment)
        
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли") 