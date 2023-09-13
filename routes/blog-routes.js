const express = require('express')
const { getAllBlogs, createBlog, editBlog, getSingleBlog, deleteBlog, getUserBlog } = require('../controllers/blog-controller')

//obj router
const router = express.Router()

//get all blogs || get
router.get('/all-blogs',getAllBlogs)

//create a blog || post
router.post('/create-blog',createBlog)

//edit blog || put
router.put('/edit-blog/:id',editBlog)

//get single blog information || get
router.get('/get-blog/:id',getSingleBlog)

//delete blog || delete
router.delete('/delete-blog/:id',deleteBlog)

//fetch user blog || get
router.get('/get-user-blog/:id',getUserBlog)

module.exports = router