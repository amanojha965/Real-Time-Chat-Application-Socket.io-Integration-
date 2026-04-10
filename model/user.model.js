import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema Definition
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password by default
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware: Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method: Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Exclude sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// ==================== USER LOGIN FUNCTION ====================

/**
 * User Login Function
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User object with response
 */
export const userLogin = async (email, password) => {
  try {
    // Validation
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
        statusCode: 400,
      };
    }

    // Check if user exists with email
    const user = await mongoose
      .model("User")
      .findOne({ email })
      .select("+password");

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      };
    }

    // Check if account is active
    if (!user.isActive) {
      return {
        success: false,
        message: "Your account has been deactivated",
        statusCode: 403,
      };
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      };
    }

    // Update user status to online
    await mongoose
      .model("User")
      .findByIdAndUpdate(user._id, { status: "online" });

    // Return user data (password excluded)
    const userData = user.toJSON();

    return {
      success: true,
      message: "Login successful",
      statusCode: 200,
      user: userData,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login failed",
      statusCode: 500,
    };
  }
};

// ==================== USER LOGOUT FUNCTION ====================

/**
 * User Logout Function
 * @param {string} userId - User ID
 * @returns {object} Logout response
 */
export const userLogout = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        statusCode: 400,
      };
    }

    // Update user status to offline
    await mongoose
      .model("User")
      .findByIdAndUpdate(userId, { status: "offline" });

    return {
      success: true,
      message: "Logout successful",
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Logout failed",
      statusCode: 500,
    };
  }
};

// ==================== GET USER BY ID ====================

/**
 * Get User By ID
 * @param {string} userId - User ID
 * @returns {object} User data
 */
export const getUserById = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required",
        statusCode: 400,
      };
    }

    const user = await mongoose.model("User").findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      statusCode: 200,
      user: user.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
      statusCode: 500,
    };
  }
};

// ==================== UPDATE USER STATUS ====================

/**
 * Update User Status
 * @param {string} userId - User ID
 * @param {string} status - User status (online/offline/away)
 * @returns {object} Updated user data
 */
export const updateUserStatus = async (userId, status) => {
  try {
    if (!userId || !status) {
      return {
        success: false,
        message: "User ID and status are required",
        statusCode: 400,
      };
    }

    const validStatuses = ["online", "offline", "away"];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: "Invalid status. Must be: online, offline, or away",
        statusCode: 400,
      };
    }

    const updatedUser = await mongoose
      .model("User")
      .findByIdAndUpdate(userId, { status }, { new: true });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Status updated successfully",
      statusCode: 200,
      user: updatedUser.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update status",
      statusCode: 500,
    };
  }
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
