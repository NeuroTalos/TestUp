from fastapi import APIRouter

from src.api.faculties import router as faculties_router
from src.api.majors import router as majors_router
from src.api.students import router as students_router
from src.api.auth import router as auth_router
from src.api.files import router as files_router
from src.api.tasks import router as tasks_router
from src.api.employers import router as employers_router
from src.api.solutions import router as solutions_router
from src.api.email import router as password_router


main_router = APIRouter()

main_router.include_router(faculties_router)
main_router.include_router(majors_router)
main_router.include_router(students_router)
main_router.include_router(employers_router)
main_router.include_router(tasks_router)
main_router.include_router(solutions_router)
main_router.include_router(auth_router)
main_router.include_router(files_router)
main_router.include_router(password_router)