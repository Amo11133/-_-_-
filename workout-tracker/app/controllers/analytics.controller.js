const db = require("../models");
const { QueryTypes } = require("sequelize");

// 1. Прогресс веса в упражнении (как менялся вес по датам)
exports.getExerciseProgress = async (req, res) => {
  const { exerciseId } = req.params;
  
  const query = `
    SELECT 
      w.date,
      we.weight_kg,
      we.sets,
      we.reps,
      we.weight_kg * we.sets * we.reps AS total_volume
    FROM workout_exercises we
    JOIN workouts w ON w.id = we."workoutId"
    WHERE we."exerciseId" = ${exerciseId}
    AND we.weight_kg IS NOT NULL
    ORDER BY w.date ASC
  `;
  
  try {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 2. Лучший подход в упражнении (максимальный вес)
exports.getBestSet = async (req, res) => {
  const { exerciseId } = req.params;
  
  const query = `
    SELECT 
      e.name AS exercise_name,
      we.weight_kg,
      we.sets,
      we.reps,
      w.date,
      we.weight_kg * we.sets * we.reps AS total_volume
    FROM workout_exercises we
    JOIN exercises e ON e.id = we."exerciseId"
    JOIN workouts w ON w.id = we."workoutId"
    WHERE we."exerciseId" = ${exerciseId}
    AND we.weight_kg IS NOT NULL
    ORDER BY we.weight_kg DESC
    LIMIT 1
  `;
  
  try {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.send(result[0] || { message: "No data found" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 3. Статистика за месяц (количество тренировок, объём, продолжительность)
exports.getMonthlyStats = async (req, res) => {
  const { userId, year, month } = req.params;
  
  const query = `
    SELECT 
      COUNT(DISTINCT w.id) AS total_workouts,
      SUM(w.duration_minutes) AS total_minutes,
      COUNT(we.id) AS total_exercises,
      SUM(we.sets) AS total_sets,
      SUM(we.reps) AS total_reps,
      SUM(we.weight_kg * we.sets * we.reps) AS total_volume
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we."workoutId"
    WHERE w."userId" = ${userId}
    AND EXTRACT(YEAR FROM w.date) = ${year}
    AND EXTRACT(MONTH FROM w.date) = ${month}
  `;
  
  try {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 4. Недельный отчёт (подробно по дням)
exports.getWeeklyReport = async (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT 
      TO_CHAR(w.date, 'YYYY-MM-DD') AS day,
      w.duration_minutes,
      w.notes,
      COUNT(we.id) AS exercises_count,
      SUM(we.sets) AS total_sets,
      SUM(we.reps) AS total_reps,
      SUM(we.weight_kg * we.sets * we.reps) AS total_volume
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we."workoutId"
    WHERE w."userId" = ${userId}
    AND w.date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY w.id, w.date, w.duration_minutes, w.notes
    ORDER BY w.date DESC
  `;
  
  try {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 5. Самое частое упражнение
exports.getMostFrequentExercise = async (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT 
      e.id,
      e.name,
      COUNT(we.id) AS times_performed,
      SUM(we.sets) AS total_sets,
      MAX(we.weight_kg) AS max_weight_used
    FROM workout_exercises we
    JOIN exercises e ON e.id = we."exerciseId"
    JOIN workouts w ON w.id = we."workoutId"
    WHERE w."userId" = ${userId}
    GROUP BY e.id, e.name
    ORDER BY times_performed DESC
    LIMIT 5
  `;
  
  try {
    const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};