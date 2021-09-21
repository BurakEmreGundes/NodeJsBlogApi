const router=require('express').Router();
const {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp}=require("../controllers/bootcamps")
const {protect,authorize}=require("../middlewares/auth")
/*router.get("/",getBootcamps)
router.get("/:id",getBootcamp)
router.post("/",createBootcamp)
router.put("/:id",updateBootcamp)
router.delete("/:id",deleteBootcamp)
*/


const advancedResults=require("../middlewares/advancedResults")
const Bootcamp=require("../models/Bootcamp")
// Include other resource routers
const courseRouter=require("./courses")
const reviewRouter=require("./reviews")

router.use("/:bootcampId/courses",courseRouter)
router.use("/:bootcampId/reviews",reviewRouter)


router.route('/').get(advancedResults(Bootcamp,"courses"),getBootcamps).post(protect,authorize("publisher","admin"),createBootcamp)

router.route("/:id").get(getBootcamp).put(protect,authorize("publisher","admin"),updateBootcamp).delete(protect ,authorize("publisher","admin"),deleteBootcamp)



module.exports=router