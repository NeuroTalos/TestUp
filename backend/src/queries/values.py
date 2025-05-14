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
        "telegram": "@username",
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
        "telegram": "@someName",
        "gender": "male",
        "course": 3,
        "group": "ИСиТ-22",
        "faculty_name": "Факультет энергетики и автоматики",
        "major_name": "Прикладная математика и информатика",
    },

    {
        "login": "Moroz25",
        "password": "123",
        "first_name": "Светлана",
        "last_name": "Морозова",
        "middle_name": None,
        "date_of_birth": date(2004, 6, 29),
        "email": "svet_mor.04@mail.ru",
        "phone": "89765432201",
        "gender": "female",
        "telegram": None,
        "course": 2,
        "group": "ИПО-23",
        "faculty_name": "Гуманитарно-педагогический факультет",
        "major_name": "Психолого-педагогическое образование",
    },
]

default_employers = [
    {
        "login": "Sber",
        "password": "123",
        "company_name": "Сбер",
        "email": "sber_hr@mail.ru",
        "phone": "86753210784",
        "telegram": "@telegramSber",
    },
    {
        "login": "Yandex",
        "password": "123",
        "company_name": "Яндекс",
        "email": "yandex_practic@mail.ru",
        "phone": "88564328132",
        "telegram": "@telegramYandex",
    },
    {
        "login": "TBank",
        "password": "123",
        "company_name": "Т-Банк",
        "email": "t_bank@mail.ru",
        "phone": "85643250123",
        "telegram": None,
    },
]

default_tasks = [
    {
        "title": "Сервис анализа текстов",
        "description": "Разработать микросервис для анализа тональности текстов. Необходимо реализовать API и базовую статистику",
        "difficulty": "medium",
        "status": "active",
        "employer_name": "Яндекс"
    },
    {
        "title": "Парсер новостей",
        "description": "Реализовать парсер новостных сайтов с сохранением данных в базу. Нужна поддержка нескольких источников и cron-запуск",
        "difficulty": "easy",
        "status": "active",
        "employer_name": "Яндекс"
    },
    {
        "title": "Лента событий для корпоративного портала",
        "description": "Реализовать ленту активности сотрудников с возможностью комментирования. Поддержка фильтрации по типу события обязательна",
        "difficulty": "medium",
        "status": "completed",
        "employer_name": "Яндекс"
    },
    {
        "title": "Банковский чат-бот",
        "description": "Создать телеграм-бота для консультации клиентов банка. Бот должен уметь определять тему вопроса и давать базовый ответ",
        "difficulty": "medium",
        "status": "active",
        "employer_name": "Т-Банк"
    },
    {
        "title": "Панель аналитики по транзакциям",
        "description": "Сделать дашборд для отображения пользовательских транзакций с фильтрами и графиками. Предусмотреть авторизацию",
        "difficulty": "medium",
        "status": "active",
        "employer_name": "Т-Банк"
    },
    {
        "title": "Умная система рекомендаций",
        "description": "Построить систему рекомендаций товаров по истории покупок. Использовать ML-библиотеки или простую эвристику",
        "difficulty": "hard",
        "status": "active",
        "employer_name": "Сбер"
    },
    {
        "title": "API проверки документов",
        "description": "Разработать REST API для проверки и валидации документов (PDF, DOCX). Нужна проверка структуры и наличие подписи",
        "difficulty": "hard",
        "status": "active",
        "employer_name": "Сбер"
    },
]

default_solutions = [
    {
        "solution_description": "Здесь находится решение задачи",
        "task_id": 1,
        "student_id": 1,
    },
]