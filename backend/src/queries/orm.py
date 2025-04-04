from sqlalchemy import select, insert
from sqlalchemy.orm import selectinload

from src.database import (
    async_engine, 
    async_session_factory, 
    Base,
    
)
from src.models import Gender, StudentsOrm, FacultiesOrm, MajorsOrm
from src.schemas import (
    StudentSchema, 
    MajorGetSchema, MajorSchema,
    FacultyGetSchema, FacultySchema)


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
            #faculties_schemas = [FacultySchema.model_validate(faculty) for faculty in faculties]
            faculties_schemas = []
            for faculty in faculties:
                # Преобразуем факультет в схему
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
            insert_students = insert(StudentsOrm).values(students)
            await session.execute(insert_students)
            await session.commit()

    # TODO make function to show faculty and major names instead of id
    @staticmethod
    async def select_students():
        async with async_session_factory() as session:
            query = select(StudentsOrm)
            result = await session.execute(query)
            students = result.scalars().all()
            students_schemas = [StudentSchema.model_validate(student) for student in students]
           
            return students_schemas
            # for student in students:
            #     student_attributes = {key: value for key, value in student.__dict__.items() if key != '_sa_instance_state'}
            #     print(student_attributes)