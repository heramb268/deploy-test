const express = require('express')
const { getAllUsers, getSingleUser, updateUserDetails, userLogin, userRegister } = require('../controllers/user-controller')

//obj router
const router = express.Router()

//get all users || get
router.get('/all-users', getAllUsers)

//get single user || get
router.get('/get-user/:id', getSingleUser)

//update user details || put
router.put('/update-user/:id',updateUserDetails)

//register or create user || post
router.post('/register', userRegister)

//login user || post
router.post('/login', userLogin)

module.exports = router