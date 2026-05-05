const db = require("../models");
const { Op } = require("sequelize");   // ← добавить импорт
const Workout = db.Workout;
const WorkoutExercise = db.WorkoutExercise;
const Exercise = db.Exercise;

// Создать тренировку
exports.create = async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).send(workout);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить все тренировки пользователя (с фильтрацией по дате)
exports.findAll = async (req, res) => {
  try {
    let where = { userId: req.query.userId };
    
    // Фильтрация по диапазону дат (параметры from и to)
    if (req.query.from && req.query.to) {
      where.date = { [Op.between]: [req.query.from, req.query.to] };
    }

    const workouts = await Workout.findAll({
      where,
      include: [{
        model: WorkoutExercise,
        include: [Exercise]
      }],
      order: [['date', 'DESC']]
    });
    res.send(workouts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить тренировку по ID
exports.findOne = async (req, res) => {
  try {
    const workout = await Workout.findByPk(req.params.id, {
      include: [{
        model: WorkoutExercise,
        include: [Exercise]
      }]
    });
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
    res.send(workout);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить тренировку
exports.update = async (req, res) => {
  try {
    const [updated] = await Workout.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Workout not found" });
    }
    const workout = await Workout.findByPk(req.params.id);
    res.send(workout);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить тренировку
exports.delete = async (req, res) => {
  try {
    const deleted = await Workout.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).send({ message: "Workout not found" });
    }
    res.send({ message: "Workout deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};