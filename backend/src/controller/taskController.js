const taskModel = require("../models/task.model");
const userModel = require("../models/user.model");
const {sendTaskNotification,} = require("../services/notificationService");

//task create
console.log(
  "sendTaskNotification type:",
  typeof sendTaskNotification
);


const createTask = async (req, resp) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
    } = req.body;

    const sender = await userModel.findById(req.user.id);

    if (!sender) {
      return resp.status(404).json({
        message: "Assigning user not found",
      });
    }

    const reciver = await userModel.findById(assignedTo);

    if (!reciver) {
      return resp.status(404).json({
        message: "User not found",
      });
    }

    // Admin can assign only to Team Leader
    if (
      sender.role === "admin" &&
      reciver.role !== "team_leader"
    ) {
      return resp.status(403).json({
        message: "Admin can assign task only to Team Leader",
      });
    }

    // Team Leader can assign only to Employee
    if (
      sender.role === "team_leader" &&
      reciver.role !== "employee"
    ) {
      return resp.status(403).json({
        message: "Team Leader can assign task only to Employee",
      });
    }

    const task = await taskModel.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      dueDate,
      priority: priority || "medium",
    });

    // Send SMS notification after task creation
    let notification = "not_sent";

    try {
      const sms = await sendTaskNotification(reciver, task);
      notification = "sent";
      console.log("SMS sent:", sms.sid);
    } catch (smsError) {
      console.error("SMS failed:", smsError.message);
    }

    return resp.status(201).json({
      message: "Task created successfully",
      task,
      notification,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};




//employee tasks 
const getMyTasks = async(req,resp)=>{
    try {
        const tasks = await taskModel.find({
            assignedTo:req.user.id//yai user ke id ke hisab se task ko find kar raha hai
        }).populate("assignedBy","name role")//ham populate kar rahe hai taki assignedBy ke andar name aur role bhi aa jaye
        .populate("assignedTo","name role")//populated ka matlab hai ki hamne jo reference diya hai uske andar ke data ko bhi le aayenge
        resp.status(200).json({
            message:"Tasks fetched successfully",
            tasks
        })
    } catch (error) {
         resp.status(500).json({
      message: error.message
    });
    }
}

// team-leader tasks
 const getLeaderTasks = async (req, res) => {
  try {

    const tasks = await taskModel.find({
      assignedTo: req.user.id//yai user ke id ke hisab se task ko find kar raha hai
    })
      .populate("assignedBy", "name role");

    res.json({
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//task status update
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Sirf pending ya completed allowed
    if (!["pending", "completed","in_progress"].includes(status)) {
      return res.status(400).json({
        message: "Status must be pending or completed or in_progress "
      });
    }

const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Sirf jis user ko task mila hai,
    // wahi apna task update kar sakta hai
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can update only your own task"
      });
    }

    task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
  createTask,
  getMyTasks,
  getLeaderTasks,
  updateTaskStatus
};
