const mongoose = require('mongoose');
const blogModel = require('../models/blog-models');
const userModel = require('../models/user-models');

// create a blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    // content Validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields.",
      });
    }
    const userInDb = await userModel.findById(user);
    // user Validation
    if (!userInDb) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user.",
      });
    }
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const newBlog = new blogModel({ title, description, image, user });
      await newBlog.save({ session });
      userInDb.blogs.push(newBlog);
      await userInDb.save({ session });
      await session.commitTransaction();
      return res.status(201).send({
        success: true,
        message: "Blog Created!",
        newBlog,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error while creating blog:", error);

    return res.status(500).send({
      success: false,
      message: "Error while creating blog.",
      error: error.message,
    });
  }
};

//edit blog
exports.editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    if (!title && !description && !image) {
      return res.status(400).send({
        success: false,
        message: "At least one field (title, description, or image) must be provided for editing.",
      });
    }
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found.",
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Blog edited',
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error while editing blog:', error);
    return res.status(500).send({
      success: false,
      message: 'Blog cannot be edited',
      error: error.message,
    });
  }
};

//get user blog
exports.getUserBlog = async (req, res) => {
  try {
    const userBlogPosts = await userModel.findById(req.params.id).populate('blogs');
    if (!userBlogPosts) {
      return res.status(404).send({
        success: false,
        message: 'No blogs found with the given user ID.',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Blogs found for the user.',
      userBlogPosts,
    });
  } catch (error) {
    console.error('Error while finding user blogs:', error);
    return res.status(500).send({
      success: false,
      message: 'Cannot find user blogs.',
      error: error.message,
    });
  }
};

//delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate('user');
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: 'Blog not found with the given ID.',
      });
    }
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: 'Blog deleted',
    });
  } catch (error) {
    console.error('Error while deleting blog:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in deleting blog.',
      error: error.message,
    });
  }
};

//get single blog
exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: 'Blog not found with the given ID.',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'Blog fetched with the given ID.',
      blog,
    });
  } catch (error) {
    console.error('Error while fetching single blog:', error);
    return res.status(500).send({
      success: false,
      message: 'Cannot fetch single blog.',
      error: error.message,
    });
  }
};

//get all users blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate('user');
    
    if (!blogs || blogs.length === 0) {
      return res.status(200).send({
        success: false,
        message: 'No blogs found.',
      });
    }
    
    return res.status(200).send({
      success: true,
      count: blogs.length,
      message: 'All blogs found.',
      blogs,
    });
  } catch (error) {
    console.error('Error in fetching blogs:', error);
    
    return res.status(500).send({
      success: false,
      message: 'Error in fetching blogs.',
      error: error.message,
    });
  }
};
