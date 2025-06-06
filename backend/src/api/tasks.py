from typing import Annotated

from fastapi import APIRouter, Depends, Request, HTTPException

from src.queries.orm import AsyncORM
from src.schemas.tasks import TaskListResponseSchema, PaginationsParams, TeskAddSchema
from src.api.auth import access_token_check, current_role

router = APIRouter(
    prefix = "/tasks",
    tags = ["Tasks"],
)


PaginationDep = Annotated[PaginationsParams, Depends(PaginationsParams)]


@router.get("")
async def select_tasks(
    paggination: PaginationDep,
    request: Request,
    token_data = Depends(access_token_check),
    ) -> TaskListResponseSchema:
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        offset = (paggination.page - 1) * paggination.limit
        
        tasks, total_count = await AsyncORM.select_tasks(
            student_id,
            limit = paggination.limit,
            offset = offset,
            order_created_at = True,
        )

        total_pages = (total_count + paggination.limit - 1) // paggination.limit

        return {
            "tasks": tasks,
            "total_pages": total_pages,
        }
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
    

@router.get("/get_last_tasks")
async def select_last_tasks(
    paggination: PaginationDep,
    request: Request,
    token_data = Depends(access_token_check),
    ) -> TaskListResponseSchema:
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        offset = (paggination.page - 1) * paggination.limit
        
        tasks, total_count = await AsyncORM.select_tasks(
            student_id,
            limit = paggination.limit,
            offset = offset,
            order_created_at = True,
        )

        total_pages = (total_count + paggination.limit - 1) // paggination.limit

        return {
            "tasks": tasks,
            "total_pages": total_pages,
        }
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.post("/add")
async def add_task(
    task: TeskAddSchema,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "employer":
        employer_id = int(token_data.sub)

        company_name = await AsyncORM.select_employer_name_by_id(employer_id)

        new_task = {
            "title": task.title,
            "description": task.description,
            "difficulty": task.difficulty,
            "status": "active",
            "employer_name": company_name,
        }

        task_id = await AsyncORM.insert_one_task([new_task])

        return {"ok": True, "task_id": task_id}
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
    

@router.get("/get_solved_tasks")
async def select_solved_tasks(
    paggination: PaginationDep,
    request: Request,
    token_data = Depends(access_token_check),
    ) -> TaskListResponseSchema:
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)
        offset = (paggination.page - 1) * paggination.limit

        task_id_list = await AsyncORM.select_solved_task_list(student_id)

        if not task_id_list:
            raise HTTPException(status_code=404, detail="Решённые задания не найдены")

        tasks, total_count = await AsyncORM.select_solved_tasks_by_ids(
            student_id=student_id,
            task_ids=task_id_list,
            limit=paggination.limit,
            offset=offset,
        )

        total_pages = (total_count + paggination.limit - 1) // paggination.limit

        return {
            "tasks": tasks,
            "total_pages": total_pages,
        }
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.get("/get_unsolved_tasks")
async def select_unsolved_tasks(
    paggination: PaginationDep,
    request: Request,
    token_data = Depends(access_token_check),
    ) -> TaskListResponseSchema:
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)
        offset = (paggination.page - 1) * paggination.limit

        task_id_list = await AsyncORM.select_unsolved_task_list(student_id)

        if not task_id_list:
            raise HTTPException(status_code=404, detail="Нерешённые задания не найдены")

        tasks, total_count = await AsyncORM.select_unsolved_tasks_by_ids(
            student_id=student_id,
            task_ids=task_id_list,
            limit=paggination.limit,
            offset=offset,
        )

        total_pages = (total_count + paggination.limit - 1) // paggination.limit

        return {
            "tasks": tasks,
            "total_pages": total_pages,
        }
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")    
    

@router.patch("/update_status")
async def update_status(
    task_id: int,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "employer":
        result = await AsyncORM.update_task_status(task_id)

        if result:
            return {"msg": "Статус задания успешно обновлён"}
        else:
            raise HTTPException(status_code=404, detail="Задание не найдено или уже завершено") 


    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли") 
        