const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.log("mongoDB error :",error.message);
        process.exit(1);//yai is liye use kiya jata hai taki agar database connect na ho to server ko band kar de
    }
}
module.exports = connectDB;