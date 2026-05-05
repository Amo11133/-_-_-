# 🏋️‍♂️ Трекинг тренировок – Workout Tracker

> Полноценное веб-приложение для учёта тренировок, отслеживания прогресса и анализа результатов.  
> Создано с любовью к спорту 🚀

## ✨ Особенности проекта

- 📅 **Календарь тренировок** – выбирайте день, добавляйте упражнения, фиксируйте подходы, повторения и веса.
- 📹 **Видеотехника упражнений** – каждое упражнение сопровождается профессиональным видео и описанием.
- 📊 **Аналитика** – лучший подход, общий объём, частота упражнений, прогресс на графиках.
- 👤 **Личный профиль** – редактируйте свой вес, рост, смотрите статистику.
- 🔐 **Аутентификация** – JWT-токены, регистрация, вход, защита личных данных.
- 🎨 **Современный дизайн** – тёмная тема, анимации, иконки Bootstrap, адаптивная вёрстка.

---

## 🛠️ Технологический стек

### Backend
- **Node.js** + **Express** – серверная логика
- **PostgreSQL** + **Sequelize** – база данных и ORM
- **JWT** + **bcryptjs** – аутентификация и хеширование паролей
- **Swagger** – интерактивная документация API

### Frontend
- **Vue 3** + **Vite** – быстрый реактивный интерфейс
- **Vue Router** – маршрутизация
- **Pinia** – управление состоянием (пользователь, токен)
- **Bootstrap 5** + **Bootstrap Icons** – стилизация и иконки
- **Axios** – HTTP-клиент

---

## 📁 Структура проекта
workout-project/
├── workout-tracker/
│   ├── app/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── workout-frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   │   └── videos/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

---

## 🚀 Установка и запуск

### Требования
- Node.js ≥ 18
- PostgreSQL ≥ 14
- Git

### 1. Клонирование репозитория

```bash
git clone https://github.com/Amo11133/workout-tracker.git
cd workout-tracker
2. Настройка бэкенда
bash
cd workout-tracker
npm install
Создайте файл .env в папке workout-tracker:

env
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=ваш_пароль
DB_NAME=workout_tracker
JWT_SECRET=super_secret_key_workout
Создайте базу данных в pgAdmin:

sql
CREATE DATABASE workout_tracker;
Запустите бэкенд:

bash
node server.js
При первом запуске Sequelize автоматически создаст все таблицы.

3. Настройка фронтенда
Откройте новый терминал и выполните:

bash
cd ../workout-frontend
npm install
Скопируйте видео упражнений в папку public/videos/ (файлы: squat.mp4, bench-press.mp4, pull-up.mp4, triceps-pulldown.mp4).

Запустите фронтенд:

bash
npm run dev
4. Готово!
Фронтенд: http://localhost:5173

Бэкенд API: http://localhost:8080

Swagger документация: http://localhost:8080/api-docs

📸 Скриншоты (примеры)
Добавьте свои скриншоты по желанию

Календарь тренировок	Детали упражнения	Профиль пользователя
https://screenshots/calendar.png	https://screenshots/exercise.png	https://screenshots/profile.png
📡 Основные API эндпоинты
Метод	Эндпоинт	Описание
POST	/api/auth/register	Регистрация пользователя
POST	/api/auth/login	Вход (возвращает JWT)
GET	/api/exercises	Список всех упражнений
GET	/api/exercises/:id	Детали упражнения (видео, мышцы)
POST	/api/workouts	Создать тренировку
GET	/api/workouts?userId=...&from=...&to=...	Получить тренировки за период
PUT	/api/users/:id	Обновить профиль (вес, рост, email)
GET	/api/analytics/best-set/:exerciseId	Лучший подход в упражнении
GET	/api/analytics/frequent/:userId	Самые частые упражнения
Полная документация – в Swagger.

🧑‍💻 Автор
Соянкин Валерий

GitHub: Amo11133

Учебное заведение: КИПУ (Крымский инженерно-педагогический университет)

Проект выполнен в рамках курсовой / лабораторных работ

