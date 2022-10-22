// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const membersShmema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['family', 'doctor']
    },
    createdAt: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'member must contain userId.']
    },
    select: {
        type: Boolean,
        default: false
    },
    phone: {
        required: true,
        type: String
    },

    name: {
        required: true,
        type: String
    },
    profileImage: {
        type: String,
        default: 'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
    },
    hiwmID: {
        type: String,
        required: true
    }
});

// ============================================================
// mongoose model
const membersModel = mongoose.model('Member', membersShmema);

// ============================================================
// exports mmombers model
module.exports = membersModel;
