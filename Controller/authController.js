const User=require("../Modules/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const registerUser=async (req,res)=>{
    try{
    const {name,email,password} = req.body;

    const userExist=await User.findOne({email});

    if(userExist) return res.status(409).json({
        message:"Email already register..."
    });
    
    const hashPassword=await bcrypt.hash(password,10);

    const user=await User.create({
        name,
        email,
        password:hashPassword,
        role:"CUSTOMER"
    });

    return res.status(201).json({
        message:`User Register Successfully....welcome ${name}`,
        data: user
    });
    }catch(error){
        return res.status(500).json({
            message:"Check Something Wrong...",
            error:error.message
        })
    }
}

const loginUser=async (req,res)=>{
    try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({
        message:"User not found ......check email or register"
    });
}
    const passwordValid=await bcrypt.compare(password,user.password);
    if(!passwordValid){
        return res.status(401).json({
        message:"Check Password...."
    });}
    const token=jwt.sign(
        {
            userId:user._id,
            email:user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    );

    return res.status(200).json({
        message:`Login Successfully...Welcome ${user.name}`,
        token:token
    });
    }catch(error){
        return res.status(500).json({
            message: "Internal server error during login",
            error: error.message
        });
    }
}

module.exports={registerUser,loginUser};