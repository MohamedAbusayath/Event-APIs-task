const Joi = require("joi");

const eventSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),

    description: Joi.string().min(5).required(),

    startTime: Joi.date().iso().required(),

    endTime: Joi.date()
        .iso()
        .greater(Joi.ref("startTime"))
        .required(),

    location: Joi.object({
        type: Joi.string()
            .valid("Point")
            .required(),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required()
    }).required()
});

const validEvent = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Validation Error",
                error: error.details[0].message
            });
        }

        req.body = value;

        next();
    };
};

const eventValid = validEvent(eventSchema);

module.exports = {
    eventValid
};