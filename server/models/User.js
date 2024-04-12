const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName : {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    profileImage: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
   

);

module.exports = mongoose.model("user",userSchema);