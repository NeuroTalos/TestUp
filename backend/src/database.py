from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from src.config import settings


# we create async engine
async_engine = create_async_engine(
    url = settings.DATABASE_URL_asyncpg,
    echo = True,
)

async_session_factory = async_sessionmaker(async_engine)


class Base(DeclarativeBase):
    __abstract__ = True
