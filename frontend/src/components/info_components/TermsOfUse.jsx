import React from 'react';

const TermsOfUse = () => {
  return (
    <div
      className="w-screen min-h-screen p-6 md:p-12 flex flex-col"
      style={{ backgroundColor: '#002040', color: 'white' }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Правила пользования
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">1. Общие положения</h2>
          <p className="text-gray-300 leading-relaxed">
            Настоящие правила регулируют использование платформы. Пользуясь сайтом, вы соглашаетесь с настоящими условиями. В противном случае использование ресурса запрещено.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">2. Регистрация</h2>
          <p className="text-gray-300 leading-relaxed">
            Для получения доступа к полному функционалу сайта требуется регистрация. При регистрации вы обязуетесь предоставить достоверную информацию.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">3. Ответственность пользователей</h2>
          <p className="text-gray-300 leading-relaxed">
            Вы несёте личную ответственность за действия, совершённые под вашей учетной записью. Запрещено публиковать материалы, нарушающие законодательство или нормы морали.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">4. Интеллектуальная собственность</h2>
          <p className="text-gray-300 leading-relaxed">
            Все тестовые задания, размещенные работодателями, а также решения, загруженные студентами, являются интеллектуальной собственностью их авторов. Скачивание и использование этих материалов допускается исключительно в рамках платформы и в целях прохождения отбора.
            <br /><br />
            Копирование, распространение или использование заданий и решений вне платформы без согласия автора запрещено. Администрация не несёт ответственности за нарушения, совершённые пользователями в отношении авторских прав.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-white">5. Изменения правил</h2>
          <p className="text-gray-300 leading-relaxed">
            Администрация оставляет за собой право изменять настоящие правила в любое время. Актуальная версия всегда доступна на этой странице.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-white">6. Контактная информация</h2>
          <p className="text-gray-300 leading-relaxed">
            Если у вас есть вопросы по правилам, свяжитесь с нами по электронной почте: <a href="mailto:testup_support@test-up.bizml.ru" className="text-blue-400 underline">testup_support@test-up.bizml.ru</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
