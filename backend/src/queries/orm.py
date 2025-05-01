from sqlalchemy import select, insert, func
from sqlalchemy.orm import selectinload, load_only
import bcrypt

from src.database import (
    async_engine, 
    async_session_factory, 
    Base,
    
)
from src.models import (
    Gender,
    Difficulty,
    Status, 
    StudentsOrm, 
    FacultiesOrm, 
    MajorsOrm,
    EmployersOrm,
    TestTasksOrm,
    TaskSolutionsOrm,
)
from src.schemas.faculties import FacultyGetSchema
from src.schemas.majors import MajorGetSchema, MajorSchema
from src.schemas.students import StudentSchema, StudentGetSchema, StudentUpdateSchema
from src.schemas.tasks import TaskGetSchema
from src.schemas.employers import EmployerGetSchema


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with async_engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
            await connection.run_sync(Base.metadata.create_all)


    # --------------INSERT--------------

    @staticmethod
    async def insert_faculties(faculties):
        async with async_session_factory() as session:
            insert_faculties = insert(FacultiesOrm).values(faculties)
            await session.execute(insert_faculties)
            await session.commit()

    @staticmethod
    async def insert_majors(majors):
        async with async_session_factory() as session:
            insert_majors = insert(MajorsOrm).values(majors)
            await session.execute(insert_majors)
            await session.commit()
    
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
    async def insert_employers(employers: list[EmployersOrm]):
        async with async_session_factory() as session:
            def encrypt_password(password: str):
                return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            
            for employer in employers:
                employer["password"] = encrypt_password(employer["password"])

            insert_employers = insert(EmployersOrm).values(employers)
            await session.execute(insert_employers)
            await session.commit()
    
    @staticmethod
    async def insert_tasks(tasks):
        async with async_session_factory() as session:
            insert_tasks = insert(TestTasksOrm).values(tasks)
            await session.execute(insert_tasks)
            await session.commit()
    
    @staticmethod
    async def insert_solutions(solutions):
        async with async_session_factory() as session:
            insert_solutions = insert(TaskSolutionsOrm).values(solutions)
            await session.execute(insert_solutions)
            await session.commit()


    # --------------SELECT--------------

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
    async def select_majors():
        async with async_session_factory() as session:
            query = select(MajorsOrm)
            result = await session.execute(query)
            majors = result.scalars().all()
            majors_schemas = [MajorSchema.model_validate(major) for major in majors]
            
            return majors_schemas
    
    @staticmethod
    async def select_students() -> list[StudentGetSchema]:
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
                    StudentsOrm.course,
                    StudentsOrm.group,
                    StudentsOrm.faculty_name,
                    StudentsOrm.major_name,
                    )
                )   
             )
            result = await session.execute(query)
            students = result.scalars().all()
            students_schemas = [StudentGetSchema.model_validate(student) for student in students]
           
            return students_schemas
        
    @staticmethod
    async def select_student_by_id(student_id: int) -> StudentGetSchema:
        async with async_session_factory() as session:
            query = (
                select(StudentsOrm)
                .filter(StudentsOrm.id == student_id)
                .options(
                    load_only(
                    StudentsOrm.first_name,
                    StudentsOrm.last_name,
                    StudentsOrm.middle_name,
                    StudentsOrm.date_of_birth,
                    StudentsOrm.email,
                    StudentsOrm.phone,
                    StudentsOrm.gender,
                    StudentsOrm.course,
                    StudentsOrm.group,
                    StudentsOrm.faculty_name,
                    StudentsOrm.major_name,
                    ),
                    selectinload(StudentsOrm.ready_solutions)
                )   
             )
            result = await session.execute(query)
            student = result.scalars().one_or_none()
            if not student:
                return False

            student_schema = StudentGetSchema.model_validate(student)
           
            return student_schema
        
    @staticmethod
    async def select_employers():
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm)
                .options(
                    load_only(
                        EmployersOrm.company_name,
                        EmployersOrm.email,
                        EmployersOrm.phone,
                    ),
                    selectinload(EmployersOrm.tasks)
                    .load_only(
                        TestTasksOrm.id,
                        TestTasksOrm.title,
                        TestTasksOrm.description,
                        TestTasksOrm.difficulty,
                        TestTasksOrm.status
                    )
                )
            )
            result = await session.execute(query)
            employers = result.scalars().all()
            employers_schemas = [EmployerGetSchema.model_validate(employer) for employer in employers]
            
            return employers_schemas
        
    @staticmethod
    async def select_tasks(limit: int, offset: int) -> tuple[list[TaskGetSchema], int]:
        async with async_session_factory() as session:
            query = (
                select(TestTasksOrm)
                .options(selectinload(TestTasksOrm.solutions))
                .limit(limit)
                .offset(offset)
            )
            result = await session.execute(query)
            tasks = result.scalars().all()
            tasks_schemas = [TaskGetSchema.model_validate(task) for task in tasks]
            
            count_query = select(func.count()).select_from(TestTasksOrm)
            total_result = await session.execute(count_query)
            total_count = total_result.scalar_one()

            return tasks_schemas, total_count

    @staticmethod
    async def check_password(login: str, plain_password: str) -> tuple[bool, str | None]:
        async with async_session_factory() as session:
            def verify_password(plain_password: str, hashed_password: str) -> bool:
                    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

            query_student = (
                select(StudentsOrm.password)
                .filter(StudentsOrm.login == login)
            )
        
            result = await session.execute(query_student)
            hashed_password = result.scalars().one_or_none()

            if hashed_password:
                return (verify_password(plain_password, hashed_password), "student")
    
            query_employer = (
                select(EmployersOrm.password)
                .filter(EmployersOrm.login == login)
            )

            result = await session.execute(query_employer)
            hashed_password = result.scalars().one_or_none()

            if hashed_password:
                return (verify_password(plain_password, hashed_password), "employer")
            
            return (False, None)

    @staticmethod
    async def select_id_by_login(login: str, role: str) -> int:
        async with async_session_factory() as session:
            if role == "student":
                query_student = (
                    select(StudentsOrm.id)
                    .filter(StudentsOrm.login == login)
                )

                result = await session.execute(query_student)
                student_id = result.scalars().one()

                return student_id
            
            elif role == "employer":
                query_employer = (
                    select(EmployersOrm.id)
                    .filter(EmployersOrm.login == login)
                )

                result = await session.execute(query_employer)
                employer_id = result.scalars().one()

                return employer_id
        

    # --------------UPDATE--------------
    
    @staticmethod
    async def update_students(student_id: int, student_data: StudentUpdateSchema) -> None:
        async with async_session_factory() as session:
            query = select(StudentsOrm).where(StudentsOrm.id == student_id)
            result = await session.execute(query)
            student = result.scalar_one_or_none()

            for key, value in student_data.model_dump(exclude_unset=True).items():
                setattr(student, key, value)

            await session.commit()
    