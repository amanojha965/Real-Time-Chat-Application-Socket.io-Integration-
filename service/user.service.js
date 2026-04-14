import mongoose from "mongoose";
import User from "../model/user.model.js";

// ==================== USER SIGNUP FUNCTION ====================

export const userSignup = async (userData) => {
  try {
    const { username, email, password, confirmPassword, fullName } = userData;

    // Validation
    if (!username || !email || !password) {
      return {
        success: false,
        message: "Username, email, and password are required",
        statusCode: 400,
      };
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
        statusCode: 400,
      };
    }

    // Password length check
    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
        statusCode: 400,
      };
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return {
        success: false,
        message: `${field} already registered`,
        statusCode: 409,
      };
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: password,
      fullName: fullName || username,
    });

    // Save user to database
    await newUser.save();

    // Return user without password
    const userResponse = newUser.toJSON();

    return {
      success: true,
      message: "User registered successfully",
      statusCode: 201,
      user: userResponse,
    };
  } catch (error) {
    console.error("Signup error:", error);

    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return {
        success: false,
        message: messages,
        statusCode: 400,
      };
    }

    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return {
        success: false,
        message: `${field} is already in use`,
        statusCode: 409,
      };
    }

    return {
      success: false,
      message: error.message || "Signup failed",
      statusCode: 500,
    };
  }
};

// ==================== CHECK USERNAME AVAILABILITY ====================

export const checkUsernameAvailability = async (username) => {
  try {
    if (!username || username.length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters",
        statusCode: 400,
        available: false,
      };
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (user) {
      return {
        success: true,
        message: "Username is taken",
        statusCode: 200,
        available: false,
      };
    }

    return {
      success: true,
      message: "Username is available",
      statusCode: 200,
      available: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
      available: false,
    };
  }
};

// ==================== CHECK EMAIL AVAILABILITY ====================

export const checkEmailAvailability = async (email) => {
  try {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Valid email required",
        statusCode: 400,
        available: false,
      };
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return {
        success: true,
        message: "Email is already registered",
        statusCode: 200,
        available: false,
      };
    }

    return {
      success: true,
      message: "Email is available",
      statusCode: 200,
      available: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
      available: false,
    };
  }
};

// ==================== GET ALL USERS ====================

export const getAllUsers = async () => {
  try {
    const users = await User.find({ isActive: true }).select(
      "-password -email" // Don't return sensitive data
    );

    return {
      success: true,
      statusCode: 200,
      totalUsers: users.length,
      users: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
    };
  }
};

// ==================== SEARCH USERS ====================

export const searchUsers = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return {
        success: false,
        message: "Search term must be at least 2 characters",
        statusCode: 400,
        users: [],
      };
    }

    const users = await User.find({
      isActive: true,
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("-password -email");

    return {
      success: true,
      statusCode: 200,
      results: users.length,
      users: users,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
      users: [],
    };
  }
};

// ==================== DELETE USER ====================

export const deleteUserAccount = async (userId, password) => {
  try {
    if (!userId || !password) {
      return {
        success: false,
        message: "User ID and password are required",
        statusCode: 400,
      };
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404,
      };
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Incorrect password",
        statusCode: 401,
      };
    }

    // Deactivate account instead of deleting
    user.isActive = false;
    user.status = "offline";
    await user.save();

    return {
      success: true,
      message: "Account deactivated successfully",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
    };
  }
};
