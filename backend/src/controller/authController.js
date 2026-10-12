const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register api
const register = async (req, resp) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return resp.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    resp.status(201).json({
      message: "User register",
      user
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};
//login api
const login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return resp.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return resp.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Token ko HTTP-only cookie mein save karo
    resp.cookie("token", token, {
      httpOnly: true,//iska matlab ye hai ki ye cookie sirf server ke liye accessible hoga, client side se access nahi hoga
     maxAge: 24 * 60 * 60 * 1000,//1 day in milliseconds
    });

    return resp.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};
//logout api
const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logout successful"
  });
};

const getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
      return res.status(400).json({
        message: "Valid phone number with country code is required",
      });
    }

    const sender = await userModel.findById(req.user.id);
    const targetUser = await userModel.findById(req.params.id);

    if (!sender || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      (sender.role === "admin" && targetUser.role !== "team_leader") ||
      (sender.role === "team_leader" && targetUser.role !== "employee")
    ) {
      return res.status(403).json({
        message: "You cannot update this user's phone number",
      });
    }

    targetUser.phone = phone;
    await targetUser.save();

    return res.status(200).json({
      message: "Phone number updated successfully",
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        phone: targetUser.phone,
        role: targetUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    register,login,logout,getMe,updateUserPhone
}
