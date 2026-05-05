const db = require("../models");
const User = db.User;

// Создать пользователя
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({
      id: user.id,
      username: user.username,
      email: user.email,
      weight: user.weight,
      height: user.height
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить всех пользователей
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить одного пользователя
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить пользователя (только свой профиль)
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    // Проверка: можно редактировать только свой профиль (или админ)
    if (req.userId != req.params.id && req.userRole !== 'admin') {
      return res.status(403).send({ message: "You can only edit your own profile" });
    }
    await user.update(req.body);
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      weight: user.weight,
      height: user.height
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};