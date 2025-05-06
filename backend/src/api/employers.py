from fastapi import APIRouter, Request, HTTPException, Depends

from src.queries.orm import AsyncORM
from src.schemas.employers import EmployerGetSchema, EmployerAddSchema, EmployerUpdateSchema
from src.api.functions import access_token_check, current_role

router = APIRouter(
    prefix = "/employers",
    tags = ["Employers"],
)


@router.get("")
async def select_employers() -> list[EmployerGetSchema]:
    students = await AsyncORM.select_employers()

    return students


@router.get("/{employer_id}")
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


@router.post("/add")
async def add_employer(employer: EmployerAddSchema):
    new_employer = {
        "login" : employer.login,
        "password" : employer.password,
        "company_name": employer.company_name,
        "email": employer.email,
        "phone": employer.phone,
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