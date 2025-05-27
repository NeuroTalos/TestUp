from fastapi import FastAPI, Request
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend

from src.database import async_engine
from src.models import (
    StudentsOrm,
    FacultiesOrm,
    MajorsOrm,
    EmployersOrm,
    TestTasksOrm,
    TestTaskFileLinks,
    TaskSolutionsOrm,
    TaskSolutionFileLinks,
)
from src.config import settings


# Cтуденты
class StudentsAdmin(ModelView, model=StudentsOrm):
    column_list = [StudentsOrm.id, StudentsOrm.login, StudentsOrm.email, StudentsOrm.course, StudentsOrm.group]
    column_searchable_list = [StudentsOrm.login, StudentsOrm.email, StudentsOrm.first_name, StudentsOrm.last_name]
    form_excluded_columns = [
        StudentsOrm.ready_solutions
    ]
    name_plural = "Студенты"

# Факультеты
class FacultiesAdmin(ModelView, model=FacultiesOrm):
    # form_columns = [FacultiesOrm.name]
    column_list = [FacultiesOrm.name]
    name_plural = "Факультеты"
    form_include_pk = True

    def get_form_columns(self):
        # Возвращаем все колонки, включая PK поле
        return ["name"]

# Направления
class MajorsAdmin(ModelView, model=MajorsOrm):
    column_list = [MajorsOrm.name, MajorsOrm.faculty_name]
    form_excluded_columns = [
        FacultiesOrm.students
    ]
    form_include_pk = True
    name_plural = "Направления"

# Работодатели
class EmployersAdmin(ModelView, model=EmployersOrm):
    column_list = [EmployersOrm.id, EmployersOrm.login, EmployersOrm.company_name, EmployersOrm.email]
    form_excluded_columns = [
        EmployersOrm.tasks
    ]
    name_plural = "Работодатели"

# Тестовые задания
class TestTasksAdmin(ModelView, model=TestTasksOrm):
    column_list = [TestTasksOrm.id, TestTasksOrm.title, TestTasksOrm.difficulty, TestTasksOrm.status, TestTasksOrm.created_at]
    column_searchable_list = [TestTasksOrm.title]
    name_plural = "Тестовые задания"

# Файлы заданий
class TaskFilesAdmin(ModelView, model=TestTaskFileLinks):
    column_list = [TestTaskFileLinks.id, TestTaskFileLinks.file_path, TestTaskFileLinks.task_id]
    name_plural = "Файлы тестовых заданий"

# Решения студентов
class SolutionsAdmin(ModelView, model=TaskSolutionsOrm):
    column_list = [TaskSolutionsOrm.id, TaskSolutionsOrm.task_id, TaskSolutionsOrm.student_id, TaskSolutionsOrm.created_at]
    name_plural = "Решения"

# Файлы решений
class SolutionFilesAdmin(ModelView, model=TaskSolutionFileLinks):
    column_list = [TaskSolutionFileLinks.id, TaskSolutionFileLinks.file_path, TaskSolutionFileLinks.solution_id]
    name_plural = "Файлы решений"


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")

        if username == settings.ADMIN_LOGIN and password == settings.ADMIN_PASSWORD:
            request.session["token"] = "secret-token"
            return True
        
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token:
            return False

        return True

authentication_backend = AdminAuth(secret_key="...")

def setup_admin(app: FastAPI):
    admin = Admin(app, async_engine, authentication_backend = authentication_backend)
    admin.add_view(StudentsAdmin)
    admin.add_view(FacultiesAdmin)
    admin.add_view(MajorsAdmin)
    admin.add_view(EmployersAdmin)
    admin.add_view(TestTasksAdmin)
    admin.add_view(TaskFilesAdmin)
    admin.add_view(SolutionsAdmin)
    admin.add_view(SolutionFilesAdmin)