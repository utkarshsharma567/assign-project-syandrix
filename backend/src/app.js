const express = require('express');
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const cors = require('cors');
const router = require('./routes/auth.routes');
const routertask = require('./routes/task.route');
const userrouter = require('./routes/user.routes');
const app = express();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize())

//all apis
app.get('/', (req, res) => {
  res.send(' hello adarsh and diksha sharma');
});
// auth api
app.use('/api/auth',router)

// tasks api
app.use('/api/tasks',routertask)
//user fetch api
app.use('/api/users',userrouter)


module.exports = app;