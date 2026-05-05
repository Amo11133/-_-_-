module.exports = app => {
  const analytics = require("../controllers/analytics.controller");
  const router = require("express").Router();

  // Прогресс веса по упражнению
  router.get("/progress/:exerciseId", analytics.getExerciseProgress);
  
  // Лучший подход в упражнении
  router.get("/best-set/:exerciseId", analytics.getBestSet);
  
  // Статистика за месяц
  router.get("/stats/:userId/:year/:month", analytics.getMonthlyStats);
  
  // Недельный отчёт
  router.get("/weekly/:userId", analytics.getWeeklyReport);
  
  // Самое частое упражнение
  router.get("/frequent/:userId", analytics.getMostFrequentExercise);

  app.use("/api/analytics", router);
};