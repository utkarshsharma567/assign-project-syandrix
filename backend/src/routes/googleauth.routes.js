const express = require("express");
const passport = require("../config/passport");
const {googleCallback} = require("../controller/googleauth.controller");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  googleCallback
);

module.exports = router;