import express from "express";
import User, { userLogin, userLogout, getUserById, updateUserStatus } from "../model/user.model.js";
import {
  userSignup,
  checkUsernameAvailability,
  checkEmailAvailability,
  getAllUsers,
  searchUsers,
  deleteUserAccount,
} from "../service/user.service.js";

const router = express.Router();

// ==================== LOGIN ROUTE ====================
/**
 * POST /api/auth/login
 * Login user with email and password
 */
router.post("/login", async (req, res) => {
  try {
    
    const { email, password } = req.body;

    // Call login function
    const response = await userLogin(email, password);

    if (!response.success) {
      return res.status(response.statusCode).json(response);
    }

    // Set session or JWT token here (if using authentication)
    // For demo: storing user ID in session
    req.session = { userId: response.user._id };

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login error: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== LOGOUT ROUTE ====================
/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", async (req, res) => {
  try {
    const userId = req.body.userId || req.session?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
        statusCode: 400,
      });
    }

    const response = await userLogout(userId);
    req.session = null; // Clear session

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout error: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== GET USER PROFILE ====================
/**
 * GET /api/auth/profile/:userId
 * Get user profile by ID
 */
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await getUserById(userId);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== UPDATE USER STATUS ====================
/**
 * PUT /api/auth/status
 * Update user status (online/offline/away)
 */
router.put("/status", async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "User ID and status are required",
        statusCode: 400,
      });
    }

    const response = await updateUserStatus(userId, status);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating status: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== SIGNUP ROUTE ====================
/**
 * POST /api/auth/signup
 * Register new user
 */
router.post("/signup", async (req, res) => {
  try {
    const response = await userSignup(req.body);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Signup error: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== CHECK USERNAME AVAILABILITY ====================
/**
 * GET /api/auth/check-username/:username
 * Check if username is available
 */
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const response = await checkUsernameAvailability(username);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking username: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== CHECK EMAIL AVAILABILITY ====================
/**
 * GET /api/auth/check-email/:email
 * Check if email is available
 */
router.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const response = await checkEmailAvailability(email);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking email: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== GET ALL USERS ====================
/**
 * GET /api/auth/users
 * Get all active users
 */
router.get("/users", async (req, res) => {
  try {
    const response = await getAllUsers();

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== SEARCH USERS ====================
/**
 * GET /api/auth/search?q=search_term
 * Search users by username or name
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search term required",
        statusCode: 400,
      });
    }

    const response = await searchUsers(q);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching users: " + error.message,
      statusCode: 500,
    });
  }
});

// ==================== DELETE USER ACCOUNT ====================
/**
 * POST /api/auth/delete-account
 * Deactivate user account
 */
router.post("/delete-account", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
        statusCode: 400,
      });
    }

    const response = await deleteUserAccount(userId, password);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting account: " + error.message,
      statusCode: 500,
    });
  }
});

export default router;
