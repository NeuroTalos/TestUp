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
        "email": "dima_chertkov@mail.ru",
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
        "password": "123",
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
        "logo_path": "Sber/sber_logo.svg",
    },
    {
        "login": "Yandex",
        "password": "123",
        "company_name": "Яндекс",
        "email": "yandex_practic@mail.ru",
        "phone": "88564328132",
        "telegram": "@telegramYandex",
        "logo_path": "Iandeks/yandex_logo.svg",
    },
    {
        "login": "TBank",
        "password": "123",
        "company_name": "Т-Банк",
        "email": "t_bank@mail.ru",
        "phone": "85643250123",
        "telegram": None,
        "logo_path": "T-Bank/tbank_logo.png",
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
        "status": "active",
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

default_test_task_file_links = [
    {
        "file_path": "task_1/Solutions.docx",
        "task_id": 1,
    },
    {
        "file_path": "task_1/Моё_решение.xlsx",
        "task_id": 1,
    },
    {
        "file_path": "task_2/Описание.txt",
        "task_id": 2,
    },
    {
        "file_path": "task_3/Архив.rar",
        "task_id": 3,
    },
]


huge_decsription = """
Разработанный сервис предоставляет пользователю функциональность анализа текстов с возможностью определения ключевых слов, 
подсчёта частоты слов и выявления тональности текста. В основе решения лежит использование методов обработки естественного языка (NLP) и библиотек, таких как spaCy и NLTK. 
Интерфейс сервиса реализован в виде веб-приложения с удобной формой ввода, поддерживающей как ручной ввод текста, так и загрузку файлов. 
Анализ проводится в реальном времени с выводом статистики, графиков и краткого резюме. Также предусмотрена возможность скачивания отчёта в формате PDF. 
Особое внимание уделено оптимизации скорости обработки и поддержке русского языка. Сервис может быть полезен для журналистов, маркетологов и студентов.
"""

huge_comment = """
Хорошая работа! 
Решение выглядит продуманным и функциональным, особенно радует поддержка русского языка и экспорт отчёта в PDF. 
Можно было бы ещё немного доработать визуализацию, но в целом — отличный результат.
"""

default_solutions = [
    {
        "solution_description": huge_decsription,
        "employer_comment": huge_comment,
        "task_id": 1,
        "student_id": 1,
    },
    {
        "solution_description": "Решение №1",
        "employer_comment": None,
        "task_id": 1,
        "student_id": 2,
    },
    {
        "solution_description": "Лучшее решение этой задачи",
        "employer_comment": None,
        "task_id": 1,
        "student_id": 3,
    },
    {
        "solution_description": "Это решение!",
        "employer_comment": None,
        "task_id": 2,
        "student_id": 1,
    },
]

default_task_solution_file_links = [
    {
        "file_path": "solution_1/Моё_решение.xlsx",
        "solution_id": 1,
    },
    {
        "file_path": "solution_1/Описание.txt",
        "solution_id": 1,
    },
    {
        "file_path": "solution_2/Решение.py",
        "solution_id": 2,
    },
    {
        "file_path": "solution_3/Solutions.docx",
        "solution_id": 3,
    },
    {
        "file_path": "solution_4/Архив.rar",
        "solution_id": 4,
    },
]