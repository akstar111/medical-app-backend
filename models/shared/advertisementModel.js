// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const advertisementSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        requried: true
    },
    endDate: {
        type: Date,
        required: [true, 'End date shoule be included.']
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    adImage: {
        type: String,
        required: [true, 'Add image should be included.']
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'member must contain userId.']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'Application must contain partner id.']
    },
    partnerEID: {
        type: String,
        required: true
    },
    paidAmount: {
        type: Number,
        required: [true, 'Paid amount should be included.']
    },
    from: {
        type: String,
        required: [true, 'From should be included.']
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inActive'],
        default: 'active'
    },
    hiwnadmID: {
        type: String,
        required: true,
        unique: true
    }
});

// ============================================================
// create new advertisement
const advertisementModel = mongoose.model('Advertisement', advertisementSchema);

// ============================================================
// export model
module.exports = advertisementModel;
