const Joi = require('joi');

const ValidList = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().allow("", null),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
}).required();



const ValidReview=Joi.object({
    comment:Joi.string().required(),
    rating:Joi.number().required(),
}).required();


module.exports = { ValidList, ValidReview };