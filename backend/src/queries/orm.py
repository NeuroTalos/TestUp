from datetime import datetime

from sqlalchemy import (
    case, select, insert, 
    func, desc, asc, delete,
    not_, exists, literal,
)
from sqlalchemy.orm import selectinload, load_only, contains_eager, with_loader_criteria
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
    TestTaskFileLinks,
    TaskSolutionFileLinks,
    EmailVerificationCodesOrm,
)
from src.schemas.faculties import FacultyGetSchema
from src.schemas.majors import MajorGetSchema, MajorSchema
from src.schemas.students import StudentSchema, StudentGetSchema, StudentUpdateSchema
from src.schemas.tasks import TaskGetSchema, UnsolvedTaskGetSchema
from src.schemas.employers import EmployerGetSchema, EmployerUpdateSchema, EmployerContactsGetSchema
from src.schemas.solutions import SolutionGetSchema, SolutionGetInTasksSchema
from src.schemas.email import EmailVeficitaionCodesSchema


status_order = case(
                    (TestTasksOrm.status == "active", 1),
                    (TestTasksOrm.status == "completed", 2),
                    else_=3
            )

order_created = desc(TestTasksOrm.created_at) 


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
    async def insert_one_task(tasks: list[dict]) -> int:
        async with async_session_factory() as session:
            task_dict = tasks[0]
            task_obj = TestTasksOrm(**task_dict)
            session.add(task_obj)
            await session.flush()
            inserted_id = task_obj.id 
            await session.commit()
            return inserted_id
    
    @staticmethod
    async def insert_tasks(tasks: list[TestTasksOrm]):
        async with async_session_factory() as session:
            insert_tasks = insert(TestTasksOrm).values(tasks)
            await session.execute(insert_tasks)
            await session.commit()

    @staticmethod
    async def insert_task_file_links(task_file_links: list[TestTaskFileLinks]):
        async with async_session_factory() as session:   
            insert_task_file_paths = insert(TestTaskFileLinks).values(task_file_links)
            await session.execute(insert_task_file_paths)
            await session.commit()
    
    @staticmethod
    async def insert_one_solution(solutions: list[dict]) -> int | bool:
        async with async_session_factory() as session:
            solution_dict = solutions[0]
            
            query = (
                select(TestTasksOrm.status)
                .filter(TestTasksOrm.id == solution_dict["task_id"]))
            
            result = await session.execute(query)
            status = result.scalar_one_or_none()

            if status == Status.active:

                solution_obj = TaskSolutionsOrm(**solution_dict)
                session.add(solution_obj)
                await session.flush()
                inserted_id = solution_obj.id 
                await session.commit()
                return inserted_id
            
            else:
                return False

    @staticmethod
    async def insert_solutions(solutions):
        async with async_session_factory() as session:
            insert_solutions = insert(TaskSolutionsOrm).values(solutions)
            await session.execute(insert_solutions)
            await session.commit()

    @staticmethod
    async def insert_solution_file_links(solution_file_links: list[TaskSolutionFileLinks]):
        async with async_session_factory() as session:   
            insert_task_file_paths = insert(TaskSolutionFileLinks).values(solution_file_links)
            await session.execute(insert_task_file_paths)
            await session.commit()

    @staticmethod
    async def store_email_code(email_verification_codes: list[EmailVerificationCodesOrm]):
        async with async_session_factory() as session:
            insert_email_verification_codes = insert(EmailVerificationCodesOrm).values(email_verification_codes)
            await session.execute(insert_email_verification_codes)
            await session.commit()

    # --------------SELECT--------------

    @staticmethod
    async def select_faculties():
        async with async_session_factory() as session:
            query = (
                select(FacultiesOrm)
                .options(selectinload(FacultiesOrm.majors).load_only(MajorsOrm.name))
                
            )
            result = await session.execute(query)
            faculties = result.scalars().all()
            faculties_schemas = []
            for faculty in faculties:
                faculty_data = FacultyGetSchema(
                    name=faculty.name,
                    majors=[MajorGetSchema(name=major.name) for major in faculty.majors]
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
                    StudentsOrm.telegram,
                    StudentsOrm.gender,
                    StudentsOrm.course,
                    StudentsOrm.group,
                    StudentsOrm.faculty_name,
                    StudentsOrm.major_name,
                    ),
                    selectinload(StudentsOrm.ready_solutions)
                    .selectinload(TaskSolutionsOrm.files)
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
                    StudentsOrm.telegram,
                    StudentsOrm.gender,
                    StudentsOrm.course,
                    StudentsOrm.group,
                    StudentsOrm.faculty_name,
                    StudentsOrm.major_name,
                    ),
                    selectinload(StudentsOrm.ready_solutions).options(
                        load_only(
                            TaskSolutionsOrm.id,
                            TaskSolutionsOrm.solution_description,
                            TaskSolutionsOrm.employer_comment,
                            TaskSolutionsOrm.task_id,
                            TaskSolutionsOrm.created_at,
                            TaskSolutionsOrm.student_id,
                        ),
                        selectinload(TaskSolutionsOrm.files)
                    )
                )   
             )
            result = await session.execute(query)
            student = result.scalars().one_or_none()
            if not student:
                return False

            student_schema = StudentGetSchema.model_validate(student)
           
            return student_schema
        
    @staticmethod
    async def select_student_name_by_id(student_id: int) -> str:
        async with async_session_factory() as session:
            query = (
                select(StudentsOrm.first_name)
                .filter(StudentsOrm.id == student_id))
            result = await session.execute(query)
            student_name = result.scalar_one_or_none()
            
            if not student_name:
                return False
           
            return student_name
        
    @staticmethod
    async def select_student_login_by_id(student_id: int) -> str:
        async with async_session_factory() as session:
            query = (
                select(StudentsOrm.login)
                .filter(StudentsOrm.id == student_id))
            result = await session.execute(query)
            student_login = result.scalar_one_or_none()
            
            if not student_login:
                return False
           
            return student_login
        
    @staticmethod
    async def select_employers():
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm)
                .options(
                    load_only(
                        EmployersOrm.company_name,
                        EmployersOrm.email,
                        EmployersOrm.telegram,
                        EmployersOrm.phone,
                        EmployersOrm.logo_path,
                    ),
                    selectinload(EmployersOrm.tasks).options(
                        load_only(
                            TestTasksOrm.id,
                            TestTasksOrm.title,
                            TestTasksOrm.description,
                            TestTasksOrm.difficulty,
                            TestTasksOrm.status,
                            TestTasksOrm.employer_name,
                            TestTasksOrm.created_at,
                            TestTasksOrm.updated_at,
                        ),
                        selectinload(TestTasksOrm.files),
                        selectinload(TestTasksOrm.solutions)
                        .selectinload(TaskSolutionsOrm.files),
                    )
                )
            )
            result = await session.execute(query)
            employers = result.scalars().all()
            employers_schemas = [EmployerGetSchema.model_validate(employer) for employer in employers]
            
            return employers_schemas
        
    @staticmethod
    async def select_employer_by_id(employer_id: int) -> EmployerGetSchema:
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm)
                .filter(EmployersOrm.id == employer_id)
                .options(
                    load_only(
                    EmployersOrm.company_name,
                    EmployersOrm.email,
                    EmployersOrm.phone,
                    EmployersOrm.telegram,
                    EmployersOrm.logo_path,
                    ),
                    selectinload(EmployersOrm.tasks).options(
                        selectinload(TestTasksOrm.files),
                        selectinload(TestTasksOrm.solutions)
                        .selectinload(TaskSolutionsOrm.files),
                    )
                )   
             )
            result = await session.execute(query)
            employer = result.scalars().one_or_none()
            if not employer:
                return False

            employer_schema = EmployerGetSchema.model_validate(employer)
           
            return employer_schema
        
    @staticmethod
    async def select_employer_tasks_by_name(employer_name: str) -> list[TaskGetSchema]:
        async with async_session_factory() as session:
            unviewed_solution_exists = (
                select(literal(True))
                .select_from(TaskSolutionsOrm)
                .where(
                    TaskSolutionsOrm.task_id == TestTasksOrm.id,
                    TaskSolutionsOrm.viewed == False
                )
                .exists()
            )

            query = (
                select(TestTasksOrm)
                .filter(TestTasksOrm.employer_name == employer_name)
                .order_by(
                    case((unviewed_solution_exists, 0), else_=1),
                    TestTasksOrm.created_at.desc(),
                )
                .options(
                        selectinload(TestTasksOrm.files),
                        selectinload(TestTasksOrm.solutions)
                        .selectinload(TaskSolutionsOrm.files),
                    )
                )   
            result = await session.execute(query)
            tasks = result.scalars().all()

            if not tasks:
                return False

            tasks_schema = [TaskGetSchema.model_validate(task) for task in tasks]
           
            return tasks_schema
        
    @staticmethod
    async def select_employer_name_by_id(employer_id: int) -> str:
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm.company_name)
                .filter(EmployersOrm.id == employer_id)
             )
            result = await session.execute(query)
            company_name = result.scalars().one_or_none()

            if not company_name:
                return False
           
            return company_name
        
    @staticmethod
    async def select_employer_contacts_by_name(company_name: str) -> EmployerContactsGetSchema:
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm)
                .filter(EmployersOrm.company_name == company_name)
                .options(
                    load_only(
                        EmployersOrm.email,
                        EmployersOrm.phone,
                        EmployersOrm.telegram,
                    )
                )
             )
            result = await session.execute(query)
            company_contacts = result.scalars().one_or_none()

            if not company_contacts:
                return False
            
            company_contacts_schema = EmployerContactsGetSchema.model_validate(company_contacts)
           
            return company_contacts_schema
    
    @staticmethod
    async def select_employer_login_by_id(employer_id: int) -> str:
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm.login)
                .filter(EmployersOrm.id == employer_id)
             )
            
            result = await session.execute(query)
            employer_login = result.scalar_one_or_none()

            if not employer_login:
                return False
           
            return employer_login
        
    @staticmethod
    async def select_employer_logo_path_by_name(company_name: str) -> str:
        async with async_session_factory() as session:
            query = (
                select(EmployersOrm.logo_path)
                .filter(EmployersOrm.company_name == company_name)
            )
            result = await session.execute(query)
            logo_path = result.scalar_one_or_none()

            if not logo_path:
                return False
           
            return logo_path
        
    @staticmethod
    async def select_tasks(student_id: int, limit: int, offset: int) -> tuple[list[TaskGetSchema], int]:
        async with async_session_factory() as session:

            query = (
                select(TestTasksOrm)
                .options(
                    selectinload(TestTasksOrm.files),
                    selectinload(TestTasksOrm.solutions)
                    .options(selectinload(TaskSolutionsOrm.files)),
                    with_loader_criteria(TaskSolutionsOrm, TaskSolutionsOrm.student_id == student_id, include_aliases=True)
                )
                .order_by(status_order, order_created)
                .limit(limit)
                .offset(offset)
            )

            result = await session.execute(query)
            tasks = result.scalars().unique().all()
            tasks_schemas = [TaskGetSchema.model_validate(task) for task in tasks]

            count_query = select(func.count()).select_from(TestTasksOrm)
            total_result = await session.execute(count_query)
            total_count = total_result.scalar_one()

            return tasks_schemas, total_count

    @staticmethod
    async def select_solved_tasks_by_ids(
        student_id: int, 
        task_ids: list[int],
        limit: int,
        offset: int,
    ) -> tuple[list[TaskGetSchema], int]:
        async with async_session_factory() as session:
            query = (
                select(TestTasksOrm)
                .join(TestTasksOrm.solutions)
                .options(
                    contains_eager(TestTasksOrm.solutions)
                    .options(selectinload(TaskSolutionsOrm.files)),
                    selectinload(TestTasksOrm.files)
                )
                .filter(
                    TestTasksOrm.id.in_(task_ids),
                    TaskSolutionsOrm.student_id == student_id
                )
                .order_by(
                    TaskSolutionsOrm.viewed.desc(),
                    status_order, 
                    order_created,
                )
                .limit(limit)
                .offset(offset)
            )

            count_query = (
                select(func.count(func.distinct(TestTasksOrm.id)))
                .join(TestTasksOrm.solutions)
                .where(
                    TestTasksOrm.id.in_(task_ids),
                    TaskSolutionsOrm.student_id == student_id
                )
            )

            result = await session.execute(query)
            tasks = result.scalars().unique().all()
            tasks_schemas = [TaskGetSchema.model_validate(task) for task in tasks]

            total_result = await session.execute(count_query)
            total_count = total_result.scalar_one()

            return tasks_schemas, total_count

    @staticmethod
    async def select_unsolved_tasks_by_ids(
        student_id: int,
        task_ids: list[int],
        limit: int,
        offset: int,
    ) -> tuple[list[TaskGetSchema], int]:
        async with async_session_factory() as session:
            subquery = (
                select(TaskSolutionsOrm.id)
                .where(
                    (TaskSolutionsOrm.task_id == TestTasksOrm.id) &
                    (TaskSolutionsOrm.student_id == student_id)
                )
                .limit(1)
            )

            query = (
                select(TestTasksOrm)
                .options(selectinload(TestTasksOrm.files)) 
                .filter(
                    TestTasksOrm.id.in_(task_ids),
                    not_(exists(subquery))
                )
                .order_by(status_order, order_created)
                .limit(limit)
                .offset(offset)
            )

            count_query = (
                select(func.count())
                .select_from(TestTasksOrm)
                .filter(
                    TestTasksOrm.id.in_(task_ids),
                    not_(exists(subquery))
                )
            )

            result = await session.execute(query)
            tasks = result.scalars().all()
            tasks_schemas = [UnsolvedTaskGetSchema.model_validate(task) for task in tasks]

            total_result = await session.execute(count_query)
            total_count = total_result.scalar_one()

            return tasks_schemas, total_count
        
    @staticmethod
    async def select_task_solutions(task_id: int) -> list[SolutionGetSchema]:
        async with async_session_factory() as session:
            query = (
                select(TaskSolutionsOrm)
                .filter(TaskSolutionsOrm.task_id == task_id)
                .options(
                        selectinload(TaskSolutionsOrm.files),
                        selectinload(TaskSolutionsOrm.student)
                        .load_only(
                            StudentsOrm.first_name,
                            StudentsOrm.last_name,
                            StudentsOrm.middle_name,
                            StudentsOrm.email,
                            StudentsOrm.phone,
                            StudentsOrm.telegram,
                            StudentsOrm.group,
                            StudentsOrm.course,
                            StudentsOrm.faculty_name,
                            StudentsOrm.major_name
                            )
                        )
                .order_by(
                    asc(TaskSolutionsOrm.viewed),
                    asc(TaskSolutionsOrm.created_at),
                )
            )  
            result = await session.execute(query)
            solutions = result.scalars().all()
            
            if not solutions:
                return False

            solutions_schema = [SolutionGetSchema.model_validate(task) for task in solutions]
           
            return solutions_schema
        
    @staticmethod
    async def select_solution_if_exist(task_id: int, student_id: int) -> SolutionGetInTasksSchema:
        async with async_session_factory() as session:
            query = (
                select(TaskSolutionsOrm)
                .filter(
                    TaskSolutionsOrm.task_id == task_id,
                    TaskSolutionsOrm.student_id == student_id,
                )
                .options(
                    selectinload(TaskSolutionsOrm.files)
                )
            )

            result = await session.execute(query)
            solution = result.scalar_one_or_none()
            
            if not solution:
                return False

            solution_schema = SolutionGetInTasksSchema.model_validate(solution)
           
            return solution_schema
        
    @staticmethod
    async def select_solved_task_list(student_id: int) -> list[int]:
        async with async_session_factory() as session:
            query = (
                select(TaskSolutionsOrm.task_id)
                .filter(
                    TaskSolutionsOrm.student_id == student_id,
                )
            )

            result = await session.execute(query)
            task_id_list = result.scalars().all()
            
            if not task_id_list:
                return False
           
            return task_id_list

    @staticmethod
    async def select_unsolved_task_list(student_id: int) -> list[int]:
        async with async_session_factory() as session:
            subquery = (
                select(TaskSolutionsOrm.id)
                .where(
                    (TaskSolutionsOrm.task_id == TestTasksOrm.id) &
                    (TaskSolutionsOrm.student_id == student_id)
                )
                .limit(1)
            )
            
            query = (
                select(TestTasksOrm.id)
                .filter(not_(exists(subquery)))
            )
            
            result = await session.execute(query)
            task_id_list = result.scalars().all()
            
            if not task_id_list:
                return False
            
            return task_id_list

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
            
    @staticmethod
    async def check_email_exist(email: str) -> bool:
        async with async_session_factory() as session:
            students_query = select(StudentsOrm).where(StudentsOrm.email == email)
            result = await session.execute(students_query)
            student = result.scalar_one_or_none()

            if student:
                return True
            
            employer_query = select(EmployersOrm).where(EmployersOrm.email == email)
            result = await session.execute(employer_query)
            employer = result.scalar_one_or_none()

            if employer:
                return True

            return False
        
    @staticmethod
    async def get_verification_code_by_email(email: str) -> EmailVerificationCodesOrm | None:
        async with async_session_factory() as session:
            result = await session.execute(
                select(EmailVerificationCodesOrm)
                .filter(EmailVerificationCodesOrm.email == email)
            )

            return result.scalar_one_or_none()   

    # --------------UPDATE--------------
    
    @staticmethod
    async def update_student(student_id: int, student_data: StudentUpdateSchema) -> None:
        async with async_session_factory() as session:
            query = select(StudentsOrm).where(StudentsOrm.id == student_id)
            result = await session.execute(query)
            student = result.scalar_one_or_none()

            for key, value in student_data.model_dump(exclude_unset=True).items():
                setattr(student, key, value)

            await session.commit()

    @staticmethod
    async def update_employer(employer_id: int, employer_data: EmployerUpdateSchema) -> None:
        async with async_session_factory() as session:
            query = select(EmployersOrm).where(EmployersOrm.id == employer_id)
            result = await session.execute(query)
            employer = result.scalar_one_or_none()

            for key, value in employer_data.model_dump(exclude_unset=True).items():
                setattr(employer, key, value)

            await session.commit()

    @staticmethod
    async def update_employer_logo_path(company_name: str, new_logo_path: str) -> None:
        async with async_session_factory() as session:
            query = select(EmployersOrm).where(EmployersOrm.company_name == company_name)
            result = await session.execute(query)
            employer = result.scalar_one_or_none()
            
            employer.logo_path = new_logo_path

            await session.commit()
    
    @staticmethod
    async def update_task_status(task_id: int) -> bool:
        async with async_session_factory() as session:
            query = (select(TestTasksOrm)
                     .filter(
                         TestTasksOrm.id == task_id,
                         TestTasksOrm.status == "active",
                    ))
            result = await session.execute(query)
            task = result.scalar_one_or_none()

            if task:
                task.status = "completed"

                await session.commit()

                return True
            
            else:
                return False
    
    @staticmethod
    async def update_solution_comment(solution_id: int, comment: str) -> None:
        async with async_session_factory() as session:
            query = select(TaskSolutionsOrm).where(TaskSolutionsOrm.id == solution_id)
            result = await session.execute(query)
            solution = result.scalar_one_or_none()

            if solution:
                solution.employer_comment = comment
                solution.viewed = True

                await session.commit()
    
    @staticmethod
    async def update_user_password(email: str, new_password: str) -> bool:
        def encrypt_password(password: str) -> str:
                return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        async with async_session_factory() as session:
            hashed_password = encrypt_password(new_password)
            query_student = select(StudentsOrm).where(StudentsOrm.email == email)
            result = await session.execute(query_student)
            student = result.scalar_one_or_none()

            if student:
                student.password = hashed_password
                await session.commit()
                return True

            query_employer = select(EmployersOrm).where(EmployersOrm.email == email)
            result = await session.execute(query_employer)
            employer = result.scalar_one_or_none()

            if employer:
                employer.password = hashed_password
                await session.commit()
                return True

            return False
        
    @staticmethod
    async def update_email_code(email: str, code: int, expires_at: datetime) -> None:
        async with async_session_factory() as session:
            query = select(EmailVerificationCodesOrm).where(EmailVerificationCodesOrm.email == email)
            result = await session.execute(query)
            email_code_info = result.scalar_one_or_none()

            if email_code_info:
                email_code_info.code = code
                email_code_info.expires_at = expires_at
                await session.commit()
        
    # --------------DELETE--------------

    @staticmethod
    async def delete_verification_code(email: str):
        async with async_session_factory() as session:
            await session.execute(
                delete(EmailVerificationCodesOrm).where(EmailVerificationCodesOrm.email == email)
            )
            await session.commit()