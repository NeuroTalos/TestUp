from typing import Annotated, Optional
from datetime import date
import enum

from sqlalchemy import (
    Date,
    Column,
    String,
    Integer,
    CheckConstraint
)
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


# date type for id
int_pk = Annotated[int, mapped_column(primary_key = True)]

# date type for string (100)
str_100 = Annotated[str, 100]


class Gender(enum.Enum):
    male = "male"
    female = "female"


class StudentOrm(Base):
    __tablename__ = "students"

    id: Mapped[int_pk]
    first_name: Mapped[str_100]
    last_name: Mapped[str_100]
    middle_name: Mapped[Optional[str_100]]
    date_of_birth: Mapped[date] = Column(Date)
    email: Mapped[str_100]
    phone: Mapped[str] = Column(String(11))
    gender: Mapped[Gender]
    cours: Mapped[int] = Column(Integer)
    faculty: Mapped[str_100]
    major: Mapped[str_100]

    __table_args__ = (
        CheckConstraint("cours > 0 AND cours < 6", name='check_cours_range')
    )

# TODO
# Normalize student model