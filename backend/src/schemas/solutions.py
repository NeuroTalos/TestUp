from pydantic import BaseModel


class SolutionsGetSchema(BaseModel):
    solution_description: str 
    task_id: int
    student_id: int

    class Config:
        from_attributes = True