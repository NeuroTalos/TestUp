from fastapi import APIRouter, HTTPException, Request, Depends

from src.queries.orm import AsyncORM
from src.schemas.students import StudentAddSchema, StudentGetSchema, StudentUpdateSchema
from src.api.functions import check_faculty, data_transform
from src.api.auth import access_token_check, current_role
    

router = APIRouter(
    prefix = "/students",
    tags = ["Students"],
)


@router.get("")
async def select_students() -> list[StudentGetSchema]:
    students = await AsyncORM.select_students()

    return students

@router.get("/current_student")
async def select_current_student(request: Request) -> StudentGetSchema:
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        current_student = await AsyncORM.select_student_by_id(student_id)

        if not current_student:
            raise HTTPException(status_code=404, detail="ID студента не найден")

        return current_student
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.get("/current_name")
async def select_current_student_name(request: Request):
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        current_student_name = await AsyncORM.select_student_name_by_id(student_id)

        if current_student_name:
            return {"name": current_student_name}
        
        else:
            raise HTTPException(status_code=404, detail="Имя студента не найдено")
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
        

@router.get("/current_login")
async def select_current_student_login(request: Request):
    token_data = await access_token_check(request)
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        current_student_login = await AsyncORM.select_student_login_by_id(student_id)

        if current_student_login:
            return {"login": current_student_login}
        
        else:
            raise HTTPException(status_code=404, detail="Студент не найден")

    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")


@router.post("/add")
async def add_student(student: StudentAddSchema, verification_code: int):
    await check_faculty(student.faculty_name)
    
    formatted_date = await data_transform(student.date_of_birth)

    code_record = await AsyncORM.get_verification_code_by_email(student.email)
    
    if not code_record or code_record.code != verification_code:
        raise HTTPException(status_code=400, detail="Неверный или истекший код подтверждения")
    if code_record.is_expired():
        raise HTTPException(status_code=400, detail="Код подтверждения истёк")
    
    await AsyncORM.delete_verification_code(student.email)

    new_student = {
        "login" : student.login,
        "password" : student.password,
        "first_name" : student.first_name,
        "last_name" : student.last_name,
        "middle_name" : student.middle_name,
        "date_of_birth" : formatted_date,
        "email" : student.email,
        "phone" : student.phone,
        "telegram": student.telegram,
        "gender" : student.gender,
        "course" : student.course,
        "group" : student.group,
        "faculty_name" : student.faculty_name,
        "major_name" : student.major_name,
    }

    await AsyncORM.insert_students([new_student])
    return {"ok": True}


@router.patch("/update_personal_info")
async def update_student_personal_info(
        student_data: StudentUpdateSchema, 
        request: Request,
        token_data = Depends(access_token_check),
    ):
    role = await current_role(request)

    if role == "student":
        student_id = int(token_data.sub)

        await AsyncORM.update_student(student_id, student_data)

        return {"ok": True}
    
    else:
        raise HTTPException(status_code=403, detail="Доступ к ресурсу ограничен для вашей роли")
