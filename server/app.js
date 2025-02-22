const express = require('express');
const app = express();
const expressSession = require('express-session')
const dotenv = require('dotenv');
const cors = require('cors')
const ApiResponse = require('./utils/ApiResponse');
dotenv.config()

// allow all
app.use(cors(
    {
        origin: ["http://localhost:3000", "http://192.168.32.112:3000"],
        credentials: true
    }
))




app.use(
    expressSession({
      // eslint-disable-next-line no-undef
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req,res,next)=>{
  console.log(req?.url)
  console.log(req?.body)
  next()
})

app.get('/', async (req,res)=>{
    res.status(200).send( new ApiResponse(200, null , "API is running successfully"))  
})

app.use('/api/v1/auth', require('./routes/authRoutes'))
app.use('/api/v1/trip', require('./routes/tripRoutes'))
app.use('/api/v1/user', require('./routes/userRoutes'))


module.exports = app
