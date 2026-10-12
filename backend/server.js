// server.js
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const PORT = process.env.PORT || 3000;

connectDB()

app.listen(PORT, () => {
  console.log(`server is running on  http://localhost:${PORT} `);
});
