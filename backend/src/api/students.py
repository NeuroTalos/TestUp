from fastapi import APIRouter, HTTPException, Request

from src.queries.orm import AsyncORM
from src.schemas.students import StudentAddSchema, StudentGetSchema
from src.api.exeptions import check_faculty, data_transform, access_token_check
    

router = APIRouter(
    prefix = "/students",
    tags = ["Students"],
)


@router.get("")
async def select_students() -> list[StudentGetSchema]:
    students = await AsyncORM.select_students()

    return students

@router.get("/{student_id}")
async def select_current_student(request: Request) -> StudentGetSchema:
    token_data = await access_token_check(request)
    
    student_id = int(token_data.sub)

    current_student = await AsyncORM.select_student_by_id(student_id)

    if not current_student:
        raise HTTPException(status_code=404, detail="Student id not found")
    
    if current_student.gender == "male":
        current_student.gender = "Мужской"
    elif current_student.gender == "female":
        current_student.gender = "Женский"

    return current_student


@router.post("")
async def add_student(student: StudentAddSchema):
    await check_faculty(student.faculty_name)
    
    formatted_date = await data_transform(student.date_of_birth)

    new_student = {
        "login" : student.login,
        "password" : student.password,
        "first_name" : student.first_name,
        "last_name" : student.last_name,
        "middle_name" : student.middle_name,
        "date_of_birth" : formatted_date,
        "email" : student.email,
        "phone" : student.phone,
        "gender" : student.gender,
        "course" : student.course,
        "group" : student.group,
        "faculty_name" : student.faculty_name,
        "major_name" : student.major_name,
    }

    await AsyncORM.insert_students([new_student])
    return {"ok": True}