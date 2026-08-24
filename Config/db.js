
const mongoose=require("mongoose");

const dbConnect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected Successfully....");
    }catch(error){
        console.error("MongoDB connection Failed......",error.message);
        process.exit(1);
    }
}

module.exports=dbConnect;