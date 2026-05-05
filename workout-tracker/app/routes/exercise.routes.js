module.exports = app => {
  const exercises = require("../controllers/exercise.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/exercises:
   *   post:
   *     summary: Создать новое упражнение
   *     tags: [Exercises]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 example: Приседания со штангой
   *               description:
   *                 type: string
   *                 example: Базовое упражнение для ног
   *               video_url:
   *                 type: string
   *                 example: https://youtube.com/watch?v=123
   *     responses:
   *       201:
   *         description: Упражнение создано
   */
  router.post("/", exercises.create);

  /**
   * @swagger
   * /api/exercises:
   *   get:
   *     summary: Получить все упражнения
   *     tags: [Exercises]
   *     responses:
   *       200:
   *         description: Список упражнений
   */
  router.get("/", exercises.findAll);

  /**
   * @swagger
   * /api/exercises/{id}:
   *   get:
   *     summary: Получить упражнение по ID
   *     tags: [Exercises]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID упражнения
   *     responses:
   *       200:
   *         description: Данные упражнения
   *       404:
   *         description: Упражнение не найдено
   */
  router.get("/:id", exercises.findOne);

  /**
   * @swagger
   * /api/exercises/{id}:
   *   put:
   *     summary: Обновить упражнение
   *     tags: [Exercises]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Упражнение обновлено
   */
  router.put("/:id", exercises.update);

  /**
   * @swagger
   * /api/exercises/{id}:
   *   delete:
   *     summary: Удалить упражнение
   *     tags: [Exercises]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Упражнение удалено
   */
  router.delete("/:id", exercises.delete);

  app.use("/api/exercises", router);
};