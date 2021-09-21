const express=require("express")
const app=express()
const morgan=require("morgan")
const connectDB=require("./config/db")
const colors=require("colors")
const errorHandler=require('./middlewares/error')
const cookieParser=require("cookie-parser")

// Load env vars
require("dotenv").config({
    path:"./config/config.env"
})
const PORT= process.env.PORT || 5000


// Connect to database
connectDB()


// Route Files
const bootcampRouter=require("./routes/bootcamps")
const courseRouter=require("./routes/courses")
const authRouter=require("./routes/auth")
const userRouter=require("./routes/user")
const reviewRouter=require("./routes/reviews")

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan("dev"))
}



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// Mount routers
app.use("/api/v1/bootcamps",bootcampRouter)
app.use("/api/v1/courses",courseRouter)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/reviews",reviewRouter)

app.use(errorHandler)

app.get("/",(req,res)=>{
    res.send("HELLO WORLD!")
})


const server=app.listen(PORT,_=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold)
})


// Handle unhandled promise rejections
process.on("unhandledRejection",(error,promise)=>{
    console.log(error)
    console.log(`Error: ${error.message}`.red.bold)
    // Close server & exit process
    server.close(()=>process.exit(1))
})


// Get token from model, create cookie and send response
const sendTokenResponse=async (user,statusCode,res)=>{
    // Create token 
    const token=await user.getSignedJwtToken()


    const options={
        httpOnly:true,
        
    }
    
    res.cookie("token",token,{httpOnly:true})
    res.status(statusCode).json({
        success:true,
        token
    })
}