from typing import Annotated, Optional
from datetime import date
import enum

from sqlalchemy import (
    Date,
    Column,
    String,
    Integer,
    CheckConstraint,
    ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


# date type for id
int_pk = Annotated[int, mapped_column(primary_key = True)]

# date type for string (100)
str_100 = Annotated[str, 100]


class Gender(enum.Enum):
    male = "male"
    female = "female"


class ContactsOrm(Base):
    __tablename__ = "contacts"

    id: Mapped[int_pk]
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    email: Mapped[str] = Column(String(100), unique=True)
    phone: Mapped[str] = Column(String(11), unique=True)

    student: Mapped["StudentOrm"] = relationship(
        back_populates = "contacts"
    )


class FacultiesOrm(Base):
    __tablename__ = 'faculties'

    id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), unique=True)

    majors: Mapped[list["MajorsOrm"]] = relationship(
        back_populates = "faculty"
    )


class MajorsOrm(Base):
    __tablename__ = 'majors'

    id: Mapped[int_pk]
    name: Mapped[str] = Column(String(100), unique=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete = "CASCADE"))

    faculty: Mapped["FacultiesOrm"] = relationship(
        back_populates = "majors"
    )

class StudentOrm(Base):
    __tablename__ = "students"

    id: Mapped[int_pk]
    first_name: Mapped[str_100]
    last_name: Mapped[str_100]
    middle_name: Mapped[Optional[str_100]]
    date_of_birth: Mapped[date] = Column(Date)
    gender: Mapped[Gender]
    cours: Mapped[int] = Column(Integer)
    
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"))
    major_id: Mapped[int] = mapped_column(ForeignKey("majors.id", ondelete="CASCADE"))

    contacs: Mapped["ContactsOrm"] = relationship(
        back_populates = "student"
    )
    
    __table_args__ = (
        CheckConstraint("cours > 0 AND cours < 6", name="check_cours_range"),
    )
