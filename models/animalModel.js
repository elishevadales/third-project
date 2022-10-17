const mongoose = require("mongoose");
const Joi = require("joi");

const animalSchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    user_id:String,
    date_created:{
      type:Date, default:Date.now()
    }
  })

  exports.AnimalModel = mongoose.model("animals",animalSchema);

  exports.validAnimal = (_reqBody) => {
    let schemaJoi = Joi.object({
      name:Joi.string().min(2).max(99).required(),
      info:Joi.string().min(2).max(99).required(),
      category:Joi.string().min(2).max(99).required(),
      img_url:Joi.string().min(2).max(10000).allow(null,""),
      price:Joi.number().min(1).max(100000).required()
    })
    return schemaJoi.validate(_reqBody)
  }