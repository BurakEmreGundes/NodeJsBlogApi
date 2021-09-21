const Review=require("../models/Review")
const asyncHandler=require("../middlewares/async")
const ErrorResponse=require("../utils/errorResponse")
const Bootcamp=require("../models/Bootcamp")

// @desc Get reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews=asyncHandler(async (req,res,next)=>{
    if(req.params.bootcampId){
        const reviews=await Review.find({bootcamp:req.params.bootcampId})
        return res.status(200).json({
            success:true,
            count:reviews.length,
            data:reviews
        })
    }else{
        return res.status(200).json(res.advancedResults)
    }
})

// @desc Get one review
// @route GET /api/v1/reviews/:id 
// @access Public
exports.getReview=asyncHandler(async (req,res,next)=>{
    const review=await Review.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name description"
    })

    // Check review
    if(!review){
        return next(new ErrorResponse(`Review not found with the id of ${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        data:review
    })

})

// @desc Create review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId
    req.body.user=req.user.id

    const bootcamp=await Bootcamp.findById(req.params.bootcampId)

    // Check bootcamp
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with the id of ${req.params.bootcampId}`,404))
    }

    // Create review
    const review=await Review.create(req.body)

    res.status(200).json({
        success:true,
        data:review
    })
})

// @desc Update Review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview=asyncHandler(async(req,res,next)=>{
    let review=await Review.findById(req.params.id)

    // Check review
    if(!review){
        return next(new ErrorResponse(`Review not found with the id of ${req.params.id}`,404))
    }

    // Make sure review belongs to user or user is admin
    if(review.user.toString()!==req.user._id&& req.user.role!=="admin"){
        return next(new ErrorResponse(`Not authorized to update review`,401))
    }

    // Update review
    review= await Review.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

    res.status(200).json({
        success:true,
        data:review
    })

})
// @desc Delete Review
// @route DELETE /api/v1/reviews/:id
// @access Private
exports.deleteReview=asyncHandler(async(req,res,next)=>{
    let review=await Review.findById(req.params.id)

    // Check review
    if(!review){
        return next(new ErrorResponse(`Review not found with the id of ${req.params.id}`,404))
    }

    // Make sure review belongs to user or user is admin
    if(review.user.toString()!==req.user._id&& req.user.role!=="admin"){
        return next(new ErrorResponse(`Not authorized to update review`,401))
    }

    // Delete review
    review.remove()

    res.status(200).json({
        success:true,
        data:review
    })

})