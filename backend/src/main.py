import sys
import os

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI

from src.queries.orm import AsyncORM
from src.schemas import StudentAddSchema, StudentSchema, FacultySchema
from src.queries.values import default_students
from src.models import StudentsOrm


app = FastAPI()

# temp solution
@asynccontextmanager
async def lifespan(app):
    await AsyncORM.create_tables()

    await AsyncORM.insert_faculties()
    await AsyncORM.insert_majors()
    await AsyncORM.insert_students(default_students)

    yield

@app.get("/faculties")
async def select_students() -> list[FacultySchema]:
    
    faculties = await AsyncORM.select_faculties()

    return faculties


@app.get("/students")
async def select_students() -> list[StudentSchema]:
    
    students = await AsyncORM.select_students()

    return students


@app.post("/students")
async def add_students(student: StudentAddSchema):
    new_student = {
        "first_name" : student.first_name,
        "last_name" : student.last_name,
        "middle_name" : student.middle_name,
        "date_of_birth" : student.date_of_birth,
        "email" : student.email,
        "phone" : student.phone,
        "gender" : student.gender,
        "cours" : student.cours,
        "faculty_id" : student.faculty_id,
        "major_id" : student.major_id
    }

    await AsyncORM.insert_students([new_student])
    return {"ok": True}


# TODO create endpoints for adding faculties and majors

# async def main():
#     await AsyncORM.create_tables()

#     await AsyncORM.insert_faculties()
#     await AsyncORM.insert_majors()
#     await AsyncORM.insert_students()

#     await AsyncORM.select_faculties()
#     await AsyncORM.select_majors()
#     await AsyncORM.select_students()
#     print(AsyncORM.select_students())


# if __name__ == "__main__":
#     asyncio.run(main())