from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload, load_only
import bcrypt

from src.database import (
    async_engine, 
    async_session_factory, 
    Base,
    
)
from src.models import Gender, StudentsOrm, FacultiesOrm, MajorsOrm
from src.schemas.faculties import FacultyGetSchema
from src.schemas.majors import MajorGetSchema, MajorSchema
from src.schemas.students import StudentSchema, StudentGetSchema


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with async_engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
            await connection.run_sync(Base.metadata.create_all)

    @staticmethod
    async def insert_faculties(faculties):
        async with async_session_factory() as session:
            insert_faculties = insert(FacultiesOrm).values(faculties)
            await session.execute(insert_faculties)
            await session.commit()

    @staticmethod
    async def select_faculties():
        async with async_session_factory() as session:
            query = (
                select(FacultiesOrm)
                .options(selectinload(FacultiesOrm.majors).load_only(MajorsOrm.name, MajorsOrm.id))
                
            )
            result = await session.execute(query)
            faculties = result.scalars().all()
            faculties_schemas = []
            for faculty in faculties:
                faculty_data = FacultyGetSchema(
                    id=faculty.id,
                    name=faculty.name,
                    majors=[MajorGetSchema(id=major.id, name=major.name) for major in faculty.majors]
                )
                faculties_schemas.append(faculty_data)
            
            return faculties_schemas
    
    @staticmethod
    async def get_faculty_by_name(name: str):
        async with async_session_factory() as session:
            query = (
                select(FacultiesOrm.name)
                .filter(FacultiesOrm.name == name)
            )
            result = await session.execute(query)
            faculties_id = result.scalars().all()
            
            return faculties_id

    @staticmethod
    async def insert_majors(majors):
        async with async_session_factory() as session:
            insert_majors = insert(MajorsOrm).values(majors)
            await session.execute(insert_majors)
            await session.commit()
    
    @staticmethod
    async def select_majors():
        async with async_session_factory() as session:
            query = select(MajorsOrm)
            result = await session.execute(query)
            majors = result.scalars().all()
            majors_schemas = [MajorSchema.model_validate(major) for major in majors]
            
            return majors_schemas
    
    @staticmethod
    async def insert_students(students: list[StudentsOrm]):
        async with async_session_factory() as session:
            def encrypt_password(password: str):
                return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

            for student in students:
                student["password"] = encrypt_password(student["password"])

            insert_students = insert(StudentsOrm).values(students)
            await session.execute(insert_students)

            await session.commit()

    @staticmethod
    async def select_students():
        async with async_session_factory() as session:
            query = (
                select(StudentsOrm)
                .options(
                    load_only(
                    StudentsOrm.first_name,
                    StudentsOrm.last_name,
                    StudentsOrm.middle_name,
                    StudentsOrm.date_of_birth,
                    StudentsOrm.email,
                    StudentsOrm.phone,
                    StudentsOrm.gender,
                    StudentsOrm.cours,
                    StudentsOrm.faculty_name,
                    StudentsOrm.major_name,
                    )
                )   
             )
            result = await session.execute(query)
            students = result.scalars().all()
            print(students)
            students_schemas = [StudentGetSchema.model_validate(student) for student in students]
           
            return students_schemas