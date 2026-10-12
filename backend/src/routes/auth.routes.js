const express = require("express");
const passport = require("../config/passport");
const protect = require("../middleware/authmiddleware");
const { login,logout, register, getMe } = require("../controller/authController");
const {googleCallback} = require("../controller/googleauth.controller");
const {
  updateUserPhone,
} = require("../controller/authController");
const allowRoles = require("../middleware/role.middleware");


const router = express.Router();

// Google Login
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"]
//   })
// );
router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.put(
  "/:id/phone",
  protect,
  allowRoles("admin", "team_leader"),
  updateUserPhone
);
router.get("/me", protect, getMe);
// Google Callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false
//   }),
//   googleCallback
// );

module.exports = router;