module.exports = (sequelize, DataTypes) => {
  const MuscleGroup = sequelize.define("muscle_group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT
  });
  return MuscleGroup;
};