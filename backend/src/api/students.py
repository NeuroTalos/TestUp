from fastapi import APIRouter

from src.queries.orm import AsyncORM
from src.schemas.students import StudentAddSchema, StudentGetSchema
from src.api.exeptions import check_faculty, data_transform
    

router = APIRouter(
    prefix = "/students",
    tags = ["Students"],
)


@router.get("")
async def select_students() -> list[StudentGetSchema]:
    
    students = await AsyncORM.select_students()

    return students


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