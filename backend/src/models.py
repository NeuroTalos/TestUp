from typing import Annotated, Optional
from datetime import date, datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import (
    Date,
    Column,
    String,
    Integer,
    CheckConstraint,
    ForeignKey,
    Text,
    Enum,
    DateTime,
    func
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
    telegram: Mapped[Optional[str_100]] = Column(String(100), unique=True, nullable=True)
    phone: Mapped[str] = Column(String(11), unique=True)
    gender: Mapped[Gender]
    course: Mapped[int] = Column(Integer)
    group: Mapped[str] = Column(String(15))
    
    faculty_name: Mapped[str] = mapped_column(
        ForeignKey("faculties.name", ondelete = "SET NULL", onupdate = "CASCADE"),
        nullable = True,
        )
    major_name: Mapped[str] = mapped_column(
        ForeignKey("majors.name", ondelete="SET NULL", onupdate = "CASCADE"),
        nullable = True,
        )

    faculty: Mapped["FacultiesOrm"] = relationship(
        "FacultiesOrm", back_populates="students", lazy="joined"
    )
    major: Mapped["MajorsOrm"] = relationship(
        "MajorsOrm", back_populates="students", lazy="joined"
    )

    ready_solutions: Mapped[Optional[list["TaskSolutionsOrm"]]] = relationship(
        back_populates = "student",
        passive_deletes = True,
    )

    __table_args__ = (
        CheckConstraint("course > 0 AND course < 6", name="check_course_range"),
    )

    def __str__(self) -> str:
        fio = f"{self.last_name} {self.first_name}"
        if self.middle_name:
            fio += f" {self.middle_name}"
        return fio


class FacultiesOrm(Base):
    __tablename__ = "faculties"

    # id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), primary_key=True)

    majors: Mapped[Optional[list["MajorsOrm"]]] = relationship(
        back_populates = "faculty",
        passive_deletes = True,
    )

    students: Mapped[Optional[list["StudentsOrm"]]] = relationship(
        back_populates="faculty", 
        passive_deletes=True,
    )

    def __str__(self) -> str:
        return self.name


class MajorsOrm(Base):
    __tablename__ = "majors"

    # id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), primary_key=True)
    faculty_name: Mapped[str] = mapped_column(ForeignKey("faculties.name", ondelete = "CASCADE", onupdate = "CASCADE"))

    faculty: Mapped["FacultiesOrm"] = relationship(
        back_populates = "majors"
    )

    students: Mapped[Optional[list["StudentsOrm"]]] = relationship(
        back_populates="major", passive_deletes=True
    )

    def __str__(self) -> str:
        return self.name


class EmployersOrm(Base):
    __tablename__ = "employers"

    id: Mapped[int_pk]
    login: Mapped[str] = Column(String(40), unique=True, index=True)
    password: Mapped[str] = Column(String(255), index=True)
    company_name: Mapped[str] = Column(String(100), unique=True)
    email: Mapped[str] = Column(String(100), unique=True)
    phone: Mapped[str] = Column(String(11), unique=True)
    telegram: Mapped[Optional[str_100]] = Column(String(100), unique=True, nullable=True)
    logo_path: Mapped[Optional[str]] = Column(String(), unique=True, nullable=True)

    tasks: Mapped[Optional[list["TestTasksOrm"]]] = relationship(
        back_populates = "employer"
    )

    def __str__(self) -> str:
        return self.company_name
    
    # TODO Make company_name field primary key


class TestTasksOrm(Base):
    __tablename__ = 'test_tasks'

    id: Mapped[int_pk]
    title: Mapped[str] = Column(String, index=True)
    description: Mapped[str] = Column(Text)
    difficulty: Mapped[Difficulty]
    status: Mapped[Status] = Column(Enum(Status), default=Status.active, index=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default = lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default = lambda: datetime.now(timezone.utc),
        onupdate = lambda: datetime.now(timezone.utc)
    )

    employer_name: Mapped[str] = mapped_column(ForeignKey("employers.company_name", ondelete = "CASCADE", onupdate = "CASCADE"))
    
    files: Mapped[Optional[list["TestTaskFileLinks"]]] = relationship(
        back_populates = "test_task",
        passive_deletes = True,
    )

    solutions: Mapped[Optional[list["TaskSolutionsOrm"]]] = relationship(
        back_populates = "task",
        passive_deletes = True,
    )

    employer: Mapped["EmployersOrm"] = relationship(
        back_populates = "tasks"
    )

    def __str__(self) -> str:
        return f"Задание №{self.id}"


class TestTaskFileLinks(Base):
    __tablename__ = 'test_task_file_links'

    id: Mapped[int_pk]
    file_path: Mapped[str] = Column(String(), unique=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("test_tasks.id", ondelete = "CASCADE", onupdate = "CASCADE"))

    test_task: Mapped["TestTasksOrm"] = relationship(
        back_populates = "files"
    )

    def __str__(self) -> str:
        return f"{self.file_path} (задание)"


class TaskSolutionsOrm(Base):
    __tablename__ = 'tasks_solutions'

    id: Mapped[int_pk]
    solution_description: Mapped[str] = Column(Text)
    task_id: Mapped[int] = mapped_column(ForeignKey("test_tasks.id", ondelete = "CASCADE", onupdate = "CASCADE"))
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete = "CASCADE", onupdate = "CASCADE"))
    employer_comment: Mapped[Optional[str]] = Column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default = lambda: datetime.now(timezone.utc)
    )

    files: Mapped[Optional[list["TaskSolutionFileLinks"]]] = relationship(
        back_populates = "task_solution",
        passive_deletes = True,
    )

    task: Mapped["TestTasksOrm"] = relationship(
        back_populates = "solutions"
    )

    student: Mapped["StudentsOrm"] = relationship(
        back_populates = "ready_solutions"
    )

    def __str__(self) -> str:
        return f"Решение №{self.id}"


class TaskSolutionFileLinks(Base):
    __tablename__ = 'task_solution_file_links'

    id: Mapped[int_pk]
    file_path: Mapped[str] = Column(String(), unique=True)
    solution_id: Mapped[int] = mapped_column(ForeignKey("tasks_solutions.id", ondelete = "CASCADE", onupdate = "CASCADE"))

    task_solution: Mapped["TaskSolutionsOrm"] = relationship(
        back_populates = "files"
    )

    def __str__(self) -> str:
        return f"{self.file_path} (решение)"