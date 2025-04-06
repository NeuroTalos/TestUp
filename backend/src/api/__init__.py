from fastapi import APIRouter

from src.api.faculties import router as faculties_router
from src.api.majors import router as majors_router
from src.api.students import router as students_router
from src.api.files import router as files_router


main_router = APIRouter()

main_router.include_router(faculties_router)
main_router.include_router(majors_router)
main_router.include_router(students_router)
main_router.include_router(files_router)