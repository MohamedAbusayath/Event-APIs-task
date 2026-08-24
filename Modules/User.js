const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        trim:true,
        enum:["ADMIN","CUSTOMER"],
        default: "CUSTOMER"
    },
    location: {
    type: {
        type: String,
        enum: ["Point"]
    },

    coordinates: {
        type: [Number]
    }
}},
    {
        timestamps:true
    }
);
userSchema.index({
    location:"2dsphere"
});

module.exports=mongoose.model("User",userSchema);