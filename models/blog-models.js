const mongoose = require('mongoose');
const {format} = require('date-fns')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true,'title is needed'],
    },
    description:{
        type:String,
        require:[true,'description is needed']
    },
    image:{
        type:String,
        require:[true,'image is needed']
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:[true,'user id needed'],
    },},
    {timestamps:true},
  );

const blogModel = mongoose.model("blog",blogSchema);
module.exports = blogModel;