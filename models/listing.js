 
const mongoose = require('mongoose');
const schema = mongoose.Schema;
let review=require("./review.js")


const listingSchema = new schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  review:[
    {
      type:schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"], 
      // required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      // required: true,
    },
  },
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
});


// This is MiddleWare  if someone delete there listing then review should be delete from their collection 
listingSchema.post("findOneAndDelete",async(listing)=>{
     if(listing){
           await review.deleteMany({_id:{$in:listing.review}})
     }
})

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;