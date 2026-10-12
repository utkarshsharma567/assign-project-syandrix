const express = require("express");

const routertask = express.Router();

const {
  createTask,
  getMyTasks,
  updateTaskStatus,
} = require("../controller/taskController");

const protect = require("../middleware/authmiddleware");
const allowRoles = require("../middleware/role.middleware");

routertask.post("/", protect, allowRoles("admin", "team_leader"), createTask);

routertask.get(
  "/my-tasks",
  protect,
  allowRoles("employee", "team_leader"),
  getMyTasks,
);

routertask.put(
  "/:id/status",
  protect,
  allowRoles("team_leader", "employee"),
  updateTaskStatus,
);

module.exports = routertask;
