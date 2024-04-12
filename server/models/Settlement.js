const mongoose = require("mongoose")

const settlementSchema = new mongoose.Schema({
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "group"
    },
    settleTo:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "user"
    },
    settleFrom:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "user"
    },
    settleDate:{
        type:String,
        required: true
    },
    settleAmount:{
        type:Number, 
        required: true
    }
  },

   

);

module.exports = mongoose.model("settlement",settlementSchema);