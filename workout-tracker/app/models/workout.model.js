module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define("workout", {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration_minutes: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    feeling: {
      type: DataTypes.ENUM('excellent', 'good', 'normal', 'bad', 'terrible'),
      defaultValue: 'normal'
    }
  });
  return Workout;
};