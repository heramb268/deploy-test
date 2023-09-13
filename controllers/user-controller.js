const userModel = require('../models/user-models')
const bcrypt = require('bcrypt')

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      count: users.length,
      success: true,
      message: "User data retrieved successfully.",
      users,
    });
  } catch (error) {
    console.error('Error in getting all users:', error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all users.",
      error: error.message,
    });
  }
};

// update user details
exports.updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const { bio, dateOfBirth } = req.body;
    try {
      const user = await userModel.findById(userId);
       if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      user.bio = bio;
      user.dateOfBirth = dateOfBirth;
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error updating user profile',
        error,
      });
    }
  };

// get a single user by ID
exports.getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found.',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'User data retrieved successfully.',
      user,
    });
  } catch (error) {
    console.error('Error in getting user by ID:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in getting user by ID.',
      error: error.message,
    });
  }
};

//registering user or create user
exports.userRegister = async (req, res) => {
    try {
      const { username, university, email, password } = req.body;
  
      // Validation
      if (!username || !university || !email || !password) {
        return res.status(400).send({
          success: false,
          message: 'Please fill in all required fields.',
        });
      }
      // Check if the user already exists
      const userInDb = await userModel.findOne({ email });
        if (userInDb) {
        return res.status(401).send({
          success: false,
          message: 'User already exists.',
        });
      }
      // Hash the password
      const hsdPass = await bcrypt.hash(password, 10);
      // Create and save a new user
      const newUser = new userModel({
        username,
        university,
        email,
        password: hsdPass,
      });
      await newUser.save();
      return res.status(201).send({
        success: true,
        message: 'New user registered.',
        user: newUser,
      });
    } catch (error) {
      console.error('Error in register callback:', error);
      return res.status(500).send({
        success: false,
        message: 'Error in register callback.',
        error: error.message,
      });
    }
  };
  
//login users
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Please enter both email and password.',
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: 'Email not registered.',
      });
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect credentials.',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Successfully logged in.',
      user,
    });
  } catch (error) {
    console.error('Error in login callback:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in login callback.',
      error: error.message,
    });
  }
};
