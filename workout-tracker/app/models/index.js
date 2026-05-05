const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Регистрация моделей
db.User = require("./user.model")(sequelize, Sequelize);
db.MuscleGroup = require("./muscle_group.model")(sequelize, Sequelize);
db.Exercise = require("./exercise.model")(sequelize, Sequelize);
db.ExerciseMuscleGroup = require("./exercise_muscle_group.model")(sequelize, Sequelize);
db.Workout = require("./workout.model")(sequelize, Sequelize);
db.WorkoutExercise = require("./workout_exercise.model")(sequelize, Sequelize);

// Определение связей (ЛР10)
// User → Workout (один ко многим)
db.User.hasMany(db.Workout, { foreignKey: 'userId' });
db.Workout.belongsTo(db.User, { foreignKey: 'userId' });

// Workout → WorkoutExercise (один ко многим)
db.Workout.hasMany(db.WorkoutExercise, { foreignKey: 'workoutId' });
db.WorkoutExercise.belongsTo(db.Workout, { foreignKey: 'workoutId' });

// Exercise → WorkoutExercise (один ко многим)
db.Exercise.hasMany(db.WorkoutExercise, { foreignKey: 'exerciseId' });
db.WorkoutExercise.belongsTo(db.Exercise, { foreignKey: 'exerciseId' });

// MuscleGroup → ExerciseMuscleGroup (один ко многим)
db.MuscleGroup.hasMany(db.ExerciseMuscleGroup, { foreignKey: 'muscleGroupId' });
db.ExerciseMuscleGroup.belongsTo(db.MuscleGroup, { foreignKey: 'muscleGroupId' });

// Exercise → ExerciseMuscleGroup (один ко многим)
db.Exercise.hasMany(db.ExerciseMuscleGroup, { foreignKey: 'exerciseId' });
db.ExerciseMuscleGroup.belongsTo(db.Exercise, { foreignKey: 'exerciseId' });

module.exports = db;