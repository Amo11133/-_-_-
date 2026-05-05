module.exports = app => {
  const workouts = require("../controllers/workout.controller");
  const router = require("express").Router();

  router.post("/", workouts.create);
  router.get("/", workouts.findAll);
  router.get("/:id", workouts.findOne);
  router.put("/:id", workouts.update);
  router.delete("/:id", workouts.delete);

  app.use("/api/workouts", router);
};