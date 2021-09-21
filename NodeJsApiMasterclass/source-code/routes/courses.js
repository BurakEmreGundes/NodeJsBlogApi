const router=require("express").Router({mergeParams:true})
const {getCourses,getCourse, addCourse,deleteCourse, updateCourse}=require("../controllers/courses")

const {protect}=require("../middlewares/auth")


router.route("/").get(getCourses).post(protect,addCourse)

router.route("/:id").get(getCourse).delete(protect,deleteCourse).put(protect,updateCourse)



module.exports=router