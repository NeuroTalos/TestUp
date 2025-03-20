from sqlalchemy import select, insert

from src.database import (
    async_engine, 
    async_session_factory, 
    Base,
    
)
from src.models import Gender, StudentsOrm, FacultiesOrm, MajorsOrm
from src.queries.values import faculties, majors, stundents


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with async_engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
            await connection.run_sync(Base.metadata.create_all)

    @staticmethod
    async def insert_faculties():
        async with async_session_factory() as session:
            insert_faculties = insert(FacultiesOrm).values(faculties)
            await session.execute(insert_faculties)
            await session.commit()


    @staticmethod
    async def select_faculties():
        async with async_session_factory() as session:
            query = select(FacultiesOrm)
            result = await session.execute(query)
            faculties = result.scalars().all()
            faculties_name = [faculty.name for faculty in faculties]
            print(faculties_name)

    @staticmethod
    async def insert_majors():
        async with async_session_factory() as session:
            insert_majors = insert(MajorsOrm).values(majors)
            await session.execute(insert_majors)
            await session.commit()
    
    # TODO Make function to show majors of selected faculty 
    @staticmethod
    async def select_majors():
        async with async_session_factory() as session:
            query = select(MajorsOrm)
            result = await session.execute(query)
            majors = result.scalars().all()
            majors_info = [(majors.faculty_id, majors.name) for majors in majors]
            print(majors_info)
    
    @staticmethod
    async def insert_students():
        async with async_session_factory() as session:
            insert_students = insert(StudentsOrm).values(stundents)
            await session.execute(insert_students)
            await session.commit()

    # TODO make function to show faculty and major names instead of id
    @staticmethod
    async def select_students():
        async with async_session_factory() as session:
            query = select(StudentsOrm)
            result = await session.execute(query)
            students = result.scalars().all()
            for student in students:
                student_attributes = {key: value for key, value in student.__dict__.items() if key != '_sa_instance_state'}
                print(student_attributes)