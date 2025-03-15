from src.database import (
    async_engine, 
    async_session_factory, 
    Base,
)
from src.models import Gender, StudentOrm, ContactsOrm, FacultiesOrm, MajorsOrm


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with async_engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
            await connection.run_sync(Base.metadata.create_all)
            print("Tables created successfully")


# TODO
# Create functions for add and select students