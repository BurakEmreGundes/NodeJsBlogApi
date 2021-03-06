const router=require("express").Router({mergeParams:true})
const {getReviews,getReview,addReview,updateReview,deleteReview}=require("../controllers/reviews")

// Authentication and Authorization middlewares
const {protect,authorize}=require("../middlewares/auth")

// Advanced results middleware
const advancedResults=require("../middlewares/advancedResults")
const Review=require("../models/Review")




router.route("/").get(advancedResults(Review,{path:"bootcamp",select:"name description"}),getReviews)
.post(protect,authorize("user","admin"),addReview)

router.route("/:id").get(getReview)
.put(protect,authorize("user,admin"),updateReview)
.delete(protect,authorize("user,admin"),deleteReview)



module.exports=router