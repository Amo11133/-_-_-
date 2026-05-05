const db = require("../models");
const Exercise = db.Exercise;
const MuscleGroup = db.MuscleGroup;
const { Op } = require("sequelize");

// Создать упражнение
exports.create = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).send(exercise);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить все упражнения
exports.findAll = async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      include: [{
        model: db.ExerciseMuscleGroup,
        include: [MuscleGroup]
      }]
    });
    res.send(exercises);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить одно упражнение по ID
exports.findOne = async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id, {
      include: [{
        model: db.ExerciseMuscleGroup,
        include: [MuscleGroup]
      }]
    });
    if (!exercise) {
      return res.status(404).send({ message: "Exercise not found" });
    }
    res.send(exercise);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить упражнение
exports.update = async (req, res) => {
  try {
    const [updated] = await Exercise.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Exercise not found" });
    }
    const exercise = await Exercise.findByPk(req.params.id);
    res.send(exercise);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить упражнение
exports.delete = async (req, res) => {
  try {
    const deleted = await Exercise.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).send({ message: "Exercise not found" });
    }
    res.send({ message: "Exercise deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить все упражнения
exports.deleteAll = async (req, res) => {
  try {
    const count = await Exercise.destroy({ where: {}, truncate: false });
    res.send({ message: `${count} exercises deleted successfully` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};