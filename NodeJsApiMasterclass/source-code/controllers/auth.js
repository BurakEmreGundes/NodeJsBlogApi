const ErrorResponse=require("../utils/errorResponse")
const asyncHandler=require("../middlewares/async")
const User=require("../models/User")



// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register=asyncHandler(async (req,res,next)=>{
   // Create user 
   const user=await User.create(req.body)

   sendTokenResponse(user,200,res)
})


// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password}= req.body
    

    if(!email || !password){
        return next(await ErrorResponse("Please provide an email and password",400))
    }

    const user=await User.findOne({email}).select("+password")
    // Check for user
    if(!user){
        return next(new ErrorResponse("Invalid credentials",401))
    }

    // Check if password matches
    const isMatch=await user.matchPassword(password)
    if(!isMatch){
       return next(new ErrorResponse("Invalid credentials",401))
    }
    sendTokenResponse(user,200,res)
})

// @desc Get user model
// @route GET /api/v1/auth/me
// @access Private
exports.getMe=asyncHandler(async (req,res,next)=>{
    const user=await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        data:user
    })
})


// @desc Update user details
// @route PUT /api/v1/auth/updatedetails
// @access Public
exports.updateDetails=asyncHandler(async (req,res,next)=>{
    const {name,email}=req.body

    const user=await User.findByIdAndUpdate(req.user._id,{name,email},{new:true,runValidators:true})

    res.status(200).json({
        success:true,
        data:user
    })
})


// @desc Update user password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user._id).select("+password")

    // Check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse("Invalid Credentails",401))
    }

    user.password=req.body.newPassword
    await user.save()

   sendTokenResponse(user,200,res)

    
}) 


// Get token from model, create cookie and send response
const sendTokenResponse=async (user,statusCode,res)=>
{
    // Create token
    const token=await user.getSignedJwtToken()
    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV==="production"){
        options.secure=true
    }

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        token
    })
}

