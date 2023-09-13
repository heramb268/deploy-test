const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/connect-db')
const path = require('path')

//env config
dotenv.config();

//route import
const userRoute = require('./routes/user-routes');
const blogRoute = require('./routes/blog-routes');

//database connection
connectDB();

//rest obj
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/blog',blogRoute);

//static files
app.use(express.static(path.join(__dirname,'./client/build')));
app.get('*', function (req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'));      
});

//Get Port from env
const PORT = process.env.PORT || 8080

//listen
app.listen(PORT, () => {
    console.log(
    'Server running on '.bgBlue.white+process.env.DEV_MODE.bgBlue.white+' mode port no. '.bgBlue.white+PORT.bgBlue.white);
});