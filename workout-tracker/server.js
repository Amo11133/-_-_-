require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./app/models");

// ==================== SWAGGER ====================
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SWAGGER КОНФИГУРАЦИЯ ====================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🏋️ Workout Tracker API",
      version: "1.0.0",
      description: "API для трекинга личных тренировок",
      contact: {
        name: "Your Name",
        email: "your@email.com"
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: "Локальный сервер"
      }
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "alex" },
            email: { type: "string", example: "alex@example.com" },
            weight: { type: "number", example: 75 },
            height: { type: "number", example: 180 }
          }
        },
        Exercise: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Приседания со штангой" },
            description: { type: "string", example: "Базовое упражнение для ног" }
          }
        },
        Workout: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            date: { type: "string", format: "date-time", example: "2026-05-04T10:00:00Z" },
            duration_minutes: { type: "integer", example: 60 },
            notes: { type: "string", example: "Отличная тренировка" },
            feeling: { type: "string", enum: ["excellent", "good", "normal", "bad", "terrible"] }
          }
        },
        WorkoutExercise: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            sets: { type: "integer", example: 4 },
            reps: { type: "integer", example: 10 },
            weight_kg: { type: "number", example: 60 },
            order: { type: "integer", example: 1 }
          }
        }
      }
    }
  },
  apis: ["./app/routes/*.routes.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== ПОДКЛЮЧЕНИЕ К БД ====================
db.sequelize.authenticate()
  .then(() => console.log("✅ Подключено к PostgreSQL"))
  .catch(err => console.log("❌ Ошибка подключения:", err));

db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ База данных синхронизирована"))
  .catch(err => console.log("❌ Ошибка синхронизации:", err));

// ==================== МАРШРУТЫ ====================
require("./app/routes/user.routes")(app);
require("./app/routes/exercise.routes")(app);
require("./app/routes/workout.routes")(app);
require("./app/routes/workout_exercise.routes")(app);
require("./app/routes/analytics.routes")(app);
require("./app/routes/auth.routes")(app);

// ==================== ТЕСТОВЫЙ МАРШРУТ ====================
app.get("/", (req, res) => {
  res.json({ 
    message: "🏋️ Workout Tracker API - готов к работе!",
    docs: `http://localhost:${process.env.PORT || 8080}/api-docs`
  });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📋 API доступен: http://localhost:${PORT}/api/`);
  console.log(`📚 Swagger документация: http://localhost:${PORT}/api-docs`);
});