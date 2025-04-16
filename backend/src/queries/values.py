# Temp file for values
from datetime import date

default_faculties = [
    {"name" : "Факультет энергетики и автоматики"},
    {"name" : "Факультет экономики и строительства"},
    {"name" : "Гуманитарно-педагогический факультет"},
]

default_majors = [
    {"name": "Информационные системы и технологии",
     "faculty_name": "Факультет энергетики и автоматики"},
    {"name": "Прикладная математика и информатика",
     "faculty_name": "Факультет энергетики и автоматики"},

    {"name": "Промышленное и гражданское строительство",
     "faculty_name": "Факультет экономики и строительства"},
    {"name": "Технологии цифровой экономики",
     "faculty_name": "Факультет экономики и строительства"},

    {"name": "Психолого-педагогическое образование",
     "faculty_name": "Гуманитарно-педагогический факультет"},
    {"name": "Юриспруденция",
     "faculty_name": "Гуманитарно-педагогический факультет"},
]

default_students = [
    {   
        "login": "dima26",
        "password": "123",
        "first_name": "Дмитрий",
        "last_name": "Чертков",
        "middle_name": "Владимирович",
        "date_of_birth": date(2001, 1, 26),
        "email": "dima26.chertkov@gmail.com",
        "phone": "84532211676",
        "gender": "male",
        "course": 4,
        "group": "ИСиТ-21",
        "faculty_name": "Факультет энергетики и автоматики",
        "major_name": "Информационные системы и технологии",
    },

    {
        "login": "Niko2003",
        "password": "mypassword",
        "first_name": "Николай",
        "last_name": "Резнов",
        "middle_name": "Викторович",
        "date_of_birth": date(2003, 5, 17),
        "email": "nik.rez1705@gmail.com",
        "phone": "86547331221",
        "gender": "male",
        "course": 3,
        "group": "ИСиТ-22",
        "faculty_name": "Факультет энергетики и автоматики",
        "major_name": "Прикладная математика и информатика",
    },

    {
        "login": "Moroz25",
        "password": "tkeohrpiodejgsrpi",
        "first_name": "Светлана",
        "last_name": "Морозова",
        "middle_name": None,
        "date_of_birth": date(2004, 6, 29),
        "email": "svet_mor.04@mail.ru",
        "phone": "89765432201",
        "gender": "female",
        "course": 2,
        "group": "ИПО-23",
        "faculty_name": "Гуманитарно-педагогический факультет",
        "major_name": "Психолого-педагогическое образование",
    },
]