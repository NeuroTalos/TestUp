from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from asyncpg.exceptions import DuplicateDatabaseError

from config import settings


# we create async engine
async_engine = create_async_engine(
    url = settings.DATABASE_URL_asyncpg,
    echo = False,
)

async_session_factory = async_sessionmaker(async_engine)

# we create BaseModel
BaseModel = declarative_base()

class Base(BaseModel):
    __abstract__ = True
