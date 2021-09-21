const router=require("express").Router()
const {createUser,getUser,getUsers,updateUser, deleteUser}=require("../controllers/user")

const {protect,authorize} =require("../middlewares/auth")
const advancedResults=require("../middlewares/advancedResults")
const User=require("../models/User")


router.use(protect)
router.use(authorize)

router.route("/:id").put(updateUser).delete(deleteUser).get(getUser)
router.route("/").post(advancedResults(User),createUser).get(getUsers)





module.exports=router