const router=require("express").Router()
const {register,login,getMe,updateDetails,updatePassword}=require("../controllers/auth")
const {protect} = require("../middlewares/auth")

router.route("/register").post(register)

router.post("/login",login)

router.get("/me",protect,getMe)

router.put("/updatedetails",protect,updateDetails)

router.put("/updatepassword",protect,updatePassword)

module.exports=router