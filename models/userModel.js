const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    booking:[{
        type: Schema.Types.ObjectId,
        ref: 'BookingDetail'
    }]
   
});
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

module.exports = User;
