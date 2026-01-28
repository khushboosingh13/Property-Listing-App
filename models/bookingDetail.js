const { number, string, date } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;   

const BookingDetailsSchema=new Schema({
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "listing",
        required: true
    },
    checkin: {
        type: String,
        required: true
    },
    checkout: {
        type: String,
        required: true
    },
    nights:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    gst:{
        type:String,        
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const BookingDetail = mongoose.model("BookingDetail", BookingDetailsSchema);
module.exports = BookingDetail;