module.exports = (sequelize, DataTypes) => {
  const ExerciseMuscleGroup = sequelize.define("exercise_muscle_group", {
    primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return ExerciseMuscleGroup;
};