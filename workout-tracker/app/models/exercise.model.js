module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define("exercise", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    video_url: DataTypes.STRING
  });
  return Exercise;
};