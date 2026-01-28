const { number, date } = require("joi");
const mongoose=require("mongoose");
let schema=mongoose.Schema;

const reviewSchema=new schema({
      comment:String,
      rating:{
          type:Number,
          min:1,
          max:5
      },
      createdAt:{
        type:Date,
        default:Date.now(),
      },
      Author:{
        type:schema.Types.ObjectId,
        ref:"User",
      },
});

module.exports=mongoose.model("Review",reviewSchema);