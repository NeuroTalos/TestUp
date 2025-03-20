import asyncio
import sys
import os

# Add root directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.queries.orm import AsyncORM


async def main():
    await AsyncORM.create_tables()

    await AsyncORM.insert_faculties()
    await AsyncORM.insert_majors()
    await AsyncORM.insert_students()

    await AsyncORM.select_faculties()
    await AsyncORM.select_majors()
    await AsyncORM.select_students()


if __name__ == "__main__":
    asyncio.run(main())