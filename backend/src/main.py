import sys
import os

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.queries.orm import AsyncORM
from src.queries.values import default_students, default_faculties, default_majors
from src.api import main_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await AsyncORM.create_tables()

    await AsyncORM.insert_faculties(default_faculties)
    await AsyncORM.insert_majors(default_majors)
    await AsyncORM.insert_students(default_students)

    yield


app = FastAPI(lifespan=lifespan)
app.include_router(main_router)


# TODO Make function for detecting IntegrityError and break transaction
