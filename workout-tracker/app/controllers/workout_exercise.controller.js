const db = require("../models");
const WorkoutExercise = db.WorkoutExercise;

// Добавить упражнение в тренировку
exports.create = async (req, res) => {
  try {
    const workoutExercise = await WorkoutExercise.create(req.body);
    res.status(201).send(workoutExercise);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить все упражнения в тренировке
exports.findByWorkout = async (req, res) => {
  try {
    const exercises = await WorkoutExercise.findAll({
      where: { workoutId: req.params.workoutId },
      order: [['order', 'ASC']]
    });
    res.send(exercises);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить подход/повторения
exports.update = async (req, res) => {
  try {
    const [updated] = await WorkoutExercise.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    const record = await WorkoutExercise.findByPk(req.params.id);
    res.send(record);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить упражнение из тренировки
exports.delete = async (req, res) => {
  try {
    const deleted = await WorkoutExercise.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.send({ message: "Exercise removed from workout" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteByWorkout = async (req, res) => {
  try {
    await db.WorkoutExercise.destroy({ where: { workoutId: req.params.workoutId } });
    res.send({ message: "All exercises removed from workout" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};