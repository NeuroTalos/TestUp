from pydantic import BaseModel


class TestTaskFileLinksSchema(BaseModel):
    id: int
    file_path: str

    class Config:
        from_attributes = True