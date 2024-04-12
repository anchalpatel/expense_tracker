const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },

    groupDescription : {
        type: String
    },

    groupCurrency: {
        type: String,
        default: "INR"
    },

    groupOwner: {
        type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
    },
    groupMembers: {
        type: Array,
        required: true
    },
    groupTotal: {
        type: Number, 
        default: 0
    },
    groupType: {
        type: String,
        default: "Others"
    },
    createdAt: {
		type: Date,
		default: Date.now
	},
    groupImage: {
        type: String,
        required: true,
    },
    split: {
        type: [[Number]]
    }
},
   

);

module.exports = mongoose.model("group",groupSchema);