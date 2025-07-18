from math import ceil

from fastapi import APIRouter, Request, HTTPException, Depends, UploadFile, File

from src.queries.orm import AsyncORM
from src.schemas.employers import EmployerGetSchema, EmployerAddSchema, EmployerUpdateSchema, EmployerContactsGetSchema
from src.schemas.tasks import TaskGetSchema, PaginationsParams
from src.api.auth import access_token_check, current_role


router = APIRouter(
    prefix = "/employers",
    tags = ["Employers"],
)


@router.get("")
async def select_employers() -> list[EmployerGetSchema]:
    students = await AsyncORM.select_employers()

    return students


@router.get("/current_employer")
async def select_current_employer(request: Request) -> EmployerGetSchema:
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "employer":
        employer_id = int(token_data.sub)

        current_employer = await AsyncORM.select_employer_by_id(employer_id)

        if not current_employer:
            raise HTTPException(status_code=404, detail="ID компании не найден")

        return current_employer
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.get("/current_tasks")
async def select_current_employer_tasks(request: Request, pagination: PaginationsParams = Depends()):
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "employer":
        employer_id = int(token_data.sub)

        employer_name = await AsyncORM.select_employer_name_by_id(employer_id)

        current_employer_tasks = await AsyncORM.select_employer_tasks_by_name(employer_name)

        if not current_employer_tasks:
            raise HTTPException(status_code=404, detail="Задания не найдены")

        total_tasks = len(current_employer_tasks)
        total_pages = ceil(total_tasks / pagination.limit) if pagination.limit > 0 else 1

        start = (pagination.page - 1) * pagination.limit
        end = start + pagination.limit
        paged_tasks = current_employer_tasks[start:end]
        
        return {
            "tasks": paged_tasks,
            "total_pages": total_pages
        }
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.get("/employer_contacts")
async def select_employer_contacts(request: Request, company_name: str) -> EmployerContactsGetSchema:
    token_data = await access_token_check(request)

    employer_contacts = await AsyncORM.select_employer_contacts_by_name(company_name)

    if employer_contacts:
        return employer_contacts
    
    else:
        raise HTTPException(status_code=404, detail="Контакты работодателя не найдены")


@router.get("/current_login")
async def select_employer_login(request: Request):
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "employer":
        employer_id = int(token_data.sub)

        employer_login = await AsyncORM.select_employer_login_by_id(employer_id)

        if employer_login:
            return {"login": employer_login}
        
        else:
            raise HTTPException(status_code=404, detail="Контакты работодателя не найдены")
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")



@router.post("/add")
async def add_employer(employer: EmployerAddSchema, verification_code: int):
    code_record = await AsyncORM.get_verification_code_by_email(employer.email)
    
    if not code_record or code_record.code != verification_code:
        raise HTTPException(status_code=400, detail="Неверный или истекший код подтверждения")
    if code_record.is_expired():
        raise HTTPException(status_code=400, detail="Код подтверждения истёк")
    await AsyncORM.delete_verification_code(employer.email)

    new_employer = {
        "login": employer.login,
        "password": employer.password,
        "company_name": employer.company_name,
        "email": employer.email,
        "phone": employer.phone,
        "telegram": employer.telegram,
        "logo_path": employer.logo_path,
    }

    await AsyncORM.insert_employers([new_employer])
    return {"ok": True}


@router.patch("/update_company_info")
async def update_company_info(
    employer_data: EmployerUpdateSchema,
    request: Request,
    token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "employer":
        employer_id = int(token_data.sub)

        await AsyncORM.update_employer(employer_id , employer_data)

        return {"ok": True}
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")