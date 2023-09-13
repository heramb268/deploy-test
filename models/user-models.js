const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'username is required']
    },
    university:{
        type:String,
        required:[true,'university is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    blogs:[
        {
          type:mongoose.Types.ObjectId,
          ref:'blog',
        },
    ],
    bio:{
        type: String,
        default: '',
    },
    profilePicture:{
        type: String,
        default: 'https://socialiti.netlify.app/imgs/request.jpg',
    },
    dateOfBirth:{
        type: String,
        default: null,
    },
},{timestamps:true});

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;