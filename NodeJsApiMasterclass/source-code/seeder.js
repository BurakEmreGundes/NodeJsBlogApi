const fs=require("fs")
const path=require("path")
const colors=require("colors")
const mongoose=require("mongoose")

// Load models
const Bootcamp=require("./models/Bootcamp")
const Course=require("./models/Course")
const User=require("./models/User")

// Load env vars
require("dotenv").config({
    path:path.join(__dirname,"./config/config.env")
})


// Read JSON files
const bootcamps=JSON.parse(fs.readFileSync("./_data/bootcamps.json"))
const courses=JSON.parse(fs.readFileSync("./_data/courses.json"))
const users=JSON.parse(fs.readFileSync("./_data/users.json"))


// MongoDB connected
mongoose.connect(process.env.MONGO_URI,
    {useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true 
    })




// Import Into DB
const importData=async ()=>{
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    console.log("Data Imported...".green.inverse);
    process.exit()  
  } catch (error) {
    
    console.error(error)
  }
}

// Delete data
const deleteData=async ()=>{
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log("Data Destroyed...".red.inverse)
        process.exit() 
    }catch(error){
        console.error(error)
    }
}


if(process.argv[2]==="-i"){
    importData()
}else if(process.argv[2]==="-d"){
    deleteData()
}

