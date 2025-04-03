import sys
import os

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI, HTTPException

from src.queries.orm import AsyncORM
from src.schemas import (
    StudentAddSchema, StudentSchema, 
    FacultySchema, FacultyAddSchema,
    MajorAddSchema
)
from src.queries.values import default_students, default_faculties, default_majors


# temp solution
@asynccontextmanager
async def lifespan(app: FastAPI):
    await AsyncORM.create_tables()

    await AsyncORM.insert_faculties(default_faculties)
    await AsyncORM.insert_majors(default_majors)
    await AsyncORM.insert_students(default_students)

    yield


app = FastAPI(lifespan=lifespan)


@app.get("/faculties")
async def select_faculties_and_majors() -> list[FacultySchema]:
    faculties = await AsyncORM.select_faculties()

    return faculties


@app.post("/faculties")
async def add_faculty(faculty: FacultyAddSchema):
    new_faculty = {
        "name" : faculty.name,
    }

    await AsyncORM.insert_faculties([new_faculty])
    return {"ok": True}


@app.post("/majors")
async def add_major(major: MajorAddSchema):
    faculty = await AsyncORM.get_faculty_by_id(major.faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    new_major = {
        "name" : major.name,
        "faculty_id": major.faculty_id 
    }

    await AsyncORM.insert_majors([new_major])
    return {"ok": True}


@app.get("/students")
async def select_students() -> list[StudentSchema]:
    
    students = await AsyncORM.select_students()

    return students


@app.post("/students")
async def add_student(student: StudentAddSchema):
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


# TODO Make function for detecting IntegrityError and break transaction

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