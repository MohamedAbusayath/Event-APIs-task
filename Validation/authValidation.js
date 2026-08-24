const Joi=require("joi");

const userSchema=Joi.object({
    name:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const validUser=(schema)=>{
    return (req,res,next)=>{
        const {error,value}=schema.validate(req.body);

        if(error) return res.status(400).json({
            message:"Validation Error...",
            error:error.details[0].message
        });
        req.body = value; 
        next();
    };
};

const registerValid=validUser(userSchema);
const loginValid=validUser(loginSchema);
module.exports={registerValid,loginValid};