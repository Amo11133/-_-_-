const auth = require("../controllers/auth.controller");

module.exports = app => {
  const users = require("../controllers/user.controller");
  const router = require("express").Router();

  router.post("/", users.create);
  router.get("/", users.findAll);
  router.get("/:id", users.findOne);
  router.put("/:id", auth.verifyToken, users.update);

  app.use("/api/users", router);
};