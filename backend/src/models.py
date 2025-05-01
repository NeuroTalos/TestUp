from typing import Annotated, Optional
from datetime import date
from enum import Enum as PyEnum

from sqlalchemy import (
    Date,
    Column,
    String,
    Integer,
    CheckConstraint,
    ForeignKey,
    Text,
    Enum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


# date type for id
int_pk = Annotated[int, mapped_column(primary_key = True)]

# date type for string (100)
str_100 = Annotated[str, 100]


class Gender(PyEnum):
    male = "male"
    female = "female"


class Difficulty(PyEnum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Status(PyEnum):
    active = "active"
    completed = "completed"


class StudentsOrm(Base):
    __tablename__ = "students"

    id: Mapped[int_pk]
    login: Mapped[str] = Column(String(40), unique=True, index=True)
    password: Mapped[str] = Column(String(255), index=True)
    first_name: Mapped[str_100]
    last_name: Mapped[str_100]
    middle_name: Mapped[Optional[str_100]]
    date_of_birth: Mapped[date] = Column(Date)
    email: Mapped[str] = Column(String(100), unique=True)
    phone: Mapped[str] = Column(String(11), unique=True)
    gender: Mapped[Gender]
    course: Mapped[int] = Column(Integer)
    group: Mapped[str] = Column(String(15))
    
    faculty_name: Mapped[str] = mapped_column(ForeignKey("faculties.name", ondelete = "CASCADE"))
    major_name: Mapped[int] = mapped_column(ForeignKey("majors.name", ondelete="CASCADE"))

    ready_solutions: Mapped[Optional[list["TaskSolutionsOrm"]]] = relationship(
        back_populates = "student"
    )

    __table_args__ = (
        CheckConstraint("course > 0 AND course < 6", name="check_course_range"),
    )


class FacultiesOrm(Base):
    __tablename__ = "faculties"

    id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), unique=True)

    majors: Mapped[Optional[list["MajorsOrm"]]] = relationship(
        back_populates = "faculty"
    )


class MajorsOrm(Base):
    __tablename__ = "majors"

    id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), unique=True)
    faculty_name: Mapped[str] = mapped_column(ForeignKey("faculties.name", ondelete = "CASCADE"))

    faculty: Mapped["FacultiesOrm"] = relationship(
        back_populates = "majors"
    )


class EmployersOrm(Base):
    __tablename__ = "employers"

    id: Mapped[int_pk]
    login: Mapped[str] = Column(String(40), unique=True, index=True)
    password: Mapped[str] = Column(String(255), index=True)
    company_name: Mapped[str] = Column(String(100), unique=True)
    email: Mapped[str] = Column(String(100), unique=True)
    phone: Mapped[str] = Column(String(11), unique=True)

    tasks: Mapped[Optional[list["TestTasksOrm"]]] = relationship(
        back_populates = "employer"
    )


class TestTasksOrm(Base):
    __tablename__ = 'test_tasks'

    id: Mapped[int_pk]
    title: Mapped[str] = Column(String, unique=True, index=True)
    description: Mapped[str] = Column(Text)
    difficulty: Mapped[Difficulty]
    status: Mapped[Status] = Column(Enum(Status), default=Status.active, index=True)
    employer_name: Mapped[str] = mapped_column(ForeignKey("employers.company_name", ondelete = "CASCADE"))
    
    solutions: Mapped[Optional[list["TaskSolutionsOrm"]]] = relationship(
        back_populates = "task"
    )

    employer: Mapped["EmployersOrm"] = relationship(
        back_populates = "tasks"
    )


class TaskSolutionsOrm(Base):
    __tablename__ = 'tasks_solutions'

    id: Mapped[int_pk]
    solution_description: Mapped[str] = Column(Text)
    task_id: Mapped[int] = mapped_column(ForeignKey("test_tasks.id", ondelete = "CASCADE"))
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete = "CASCADE"))

    task: Mapped["TestTasksOrm"] = relationship(
        back_populates = "solutions"
    )

    student: Mapped["StudentsOrm"] = relationship(
        back_populates = "ready_solutions"
    )

