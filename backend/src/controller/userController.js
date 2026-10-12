const userModel = require("../models/user.model");


const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({
        message: "Role is required"
      });
    }

    const users = await userModel
      .find({ role })
      .select("-password")
      .lean();

    return res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};





module.exports = {
  getUsersByRole,
   
};