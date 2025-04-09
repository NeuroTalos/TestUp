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


class StudentsOrm(Base):
    __tablename__ = "students"

    id: Mapped[int_pk]
    login: Mapped[str] = Column(String(40), unique=True)
    password: Mapped[str] = Column(String(255))
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

    # def check_password(self, password: str) -> bool:
    #     return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))
    
    # TODO Make fucntion for check_password

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


