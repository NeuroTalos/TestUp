# Temp file for values
from datetime import date

faculties = [
    {"name" : "Факультет энергетики и автоматики"},
    {"name" : "Факультет экономики и строительства"},
    {"name" : "Гуманитарно-педагогический факультет"},
]

majors = [
    {"name": "Информационные системы и технологии",
     "faculty_id": 1},
    {"name": "Прикладная математика и информатика",
     "faculty_id": 1},

    {"name": "Промышленное и гражданское строительство",
     "faculty_id": 2},
    {"name": "Технологии цифровой экономики",
     "faculty_id": 2},

    {"name": "Психолого-педагогическое образование",
     "faculty_id": 3},
    {"name": "Юриспруденция",
     "faculty_id": 3},
]

default_students = [
    {
        "first_name": "Дмитрий",
        "last_name": "Чертков",
        "middle_name": "Владимирович",
        "date_of_birth": date(2001, 1, 26),
        "email": "dima26.chertkov@gmail.com",
        "phone": "84532211676",
        "gender": "male",
        "cours": 4,
        "faculty_id": 1,
        "major_id": 1,
    },

    {
        "first_name": "Николай",
        "last_name": "Резнов",
        "middle_name": "Викторович",
        "date_of_birth": date(2003, 5, 17),
        "email": "nik.rez1705@gmail.com",
        "phone": "86547331221",
        "gender": "male",
        "cours": 3,
        "faculty_id": 1,
        "major_id": 2,
    },

    {
        "first_name": "Светлана",
        "last_name": "Морозова",
        "middle_name": None,
        "date_of_birth": date(2004, 6, 29),
        "email": "svet_mor.04@mail.ru",
        "phone": "89765432201",
        "gender": "female",
        "cours": 2,
        "faculty_id": 3,
        "major_id": 1,
    },
]