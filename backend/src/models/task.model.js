const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
 description: {
      type: String
    },
 status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending"
    },
    priority:{
      type:String,
      enum:["low","medium","high"],
      default:"medium",
    },
 assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
 assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
 message: {
      type: String,
      default: ""
    },
 dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);