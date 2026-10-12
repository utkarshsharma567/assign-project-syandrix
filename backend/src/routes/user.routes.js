const express = require("express");

const userrouter = express.Router();

const protect = require("../middleware/authmiddleware");
const allowRoles = require("../middleware/role.middleware");

const {
  getUsersByRole
} = require("../controller/userController");


userrouter.get(
  "/",
  protect,
  allowRoles("admin", "team_leader"),
  getUsersByRole
);


module.exports = userrouter;