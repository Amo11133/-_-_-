module.exports = app => {
  const we = require("../controllers/workout_exercise.controller");
  const router = require("express").Router();

  router.post("/", we.create);
  router.get("/workout/:workoutId", we.findByWorkout);
  router.put("/:id", we.update);
  router.delete("/:id", we.delete);
  router.delete("/workout/:workoutId", we.deleteByWorkout);

  app.use("/api/workout-exercises", router);
};