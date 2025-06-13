import sys
import os
import asyncio

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.queries.orm import AsyncORM
from src.queries.values import(
    default_students, 
    default_faculties, 
    default_majors,
    default_employers,
    default_tasks,
    default_test_task_file_links,
    default_solutions,
    default_task_solution_file_links,
    )
from src.api import main_router
from src.api.functions import run_task_due_date_checker


@asynccontextmanager
async def lifespan(app: FastAPI):
    await AsyncORM.create_tables()

    await AsyncORM.insert_faculties(default_faculties)
    await AsyncORM.insert_majors(default_majors)
    await AsyncORM.insert_students(default_students)
    await AsyncORM.insert_employers(default_employers)
    await AsyncORM.insert_tasks(default_tasks)
    await AsyncORM.insert_solutions(default_solutions)
    await AsyncORM.insert_task_file_links(default_test_task_file_links)
    await AsyncORM.insert_solution_file_links(default_task_solution_file_links)

    task = asyncio.create_task(run_task_due_date_checker())

    try:
        yield
    finally:
        task.cancel()

        try:
            await task
        except asyncio.CancelledError:
            pass


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://localhost:5173",
    "https://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://localhost:4173",
    "https://127.0.0.1:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
    "http://213.171.24.236:4173",
    "https://213.171.24.236:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers=["*"],
)

app.include_router(main_router)

from src.admin import setup_admin
setup_admin(app)