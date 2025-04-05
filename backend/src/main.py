import sys
import os

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from contextlib import asynccontextmanager
import asyncio
from pathlib import Path
import uuid

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

from src.queries.orm import AsyncORM
from src.schemas import (
    StudentAddSchema, StudentSchema, 
    FacultySchema, FacultyAddSchema, FacultyGetSchema,
    MajorAddSchema, MajorGetSchema
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

MAX_FILE_SIZE = 1 * 1024 * 1024
UPLOAD_DIRECTORY = "src/files"

@app.get("/faculties")
async def select_faculties_and_majors() -> list[FacultyGetSchema]:
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
    faculty = await AsyncORM.get_faculty_by_name(major.faculty_name)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    new_major = {
        "name" : major.name,
        "faculty_name": major.faculty_name
    }

    await AsyncORM.insert_majors([new_major])
    return {"ok": True}


@app.get("/students")
async def select_students() -> list[StudentSchema]:
    
    students = await AsyncORM.select_students()

    return students


@app.post("/students")
async def add_student(student: StudentAddSchema):
    faculty = await AsyncORM.get_faculty_by_name(student.faculty_name)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    new_student = {
        "first_name" : student.first_name,
        "last_name" : student.last_name,
        "middle_name" : student.middle_name,
        "date_of_birth" : student.date_of_birth,
        "email" : student.email,
        "phone" : student.phone,
        "gender" : student.gender,
        "cours" : student.cours,
        "faculty_name" : student.faculty_name,
        "major_name" : student.major_name,
    }

    await AsyncORM.insert_students([new_student])
    return {"ok": True}


@app.post("/files")
async def upload_file(file: UploadFile = File(...)):
    if len(await file.read()) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 1 MB limit."
        )
    
    await file.seek(0)

    file_id = str(uuid.uuid4())
    file_location = Path(f"{UPLOAD_DIRECTORY}/{file_id}_{file.filename}")

    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"file_id": file_id, "filename": file.filename}


# @app.get("/files/{file_id}")
# async def get_file(file_id: str):
#     return FileResponse(f"{UPLOAD_DIRECTORY}/{file_id}")


# TODO Make endpoint for download files

# TODO Make function for detecting IntegrityError and break transaction
