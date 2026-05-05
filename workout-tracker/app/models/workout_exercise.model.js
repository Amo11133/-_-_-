module.exports = (sequelize, DataTypes) => {
  const WorkoutExercise = sequelize.define("workout_exercise", {
    sets: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    weight_kg: DataTypes.FLOAT,
    order: DataTypes.INTEGER
  });
  return WorkoutExercise;
};