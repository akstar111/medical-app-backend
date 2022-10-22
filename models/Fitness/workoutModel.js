// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be included']
    },
    shortDescription: {
        type: String,
        required: [true, 'Write short quotes for your workout videos']
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        select: false
    },
    partnerEId: {
        type: String
    },
    uploadedBy: {
        type: String,
        requried: true,
        enum: ['partner', 'admin'],

        select: false
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['gym', 'yoga', 'meditation']
    },
    uses: {
        type: String,
        required: [true, 'Uses should be included.']
    },
    instruction: {
        type: [String],
        required: [true, 'instruction should be included.']
    },
    createdAt: {
        type: Date,
        required: [true, 'Created Date should be included.']
    },
    video: {
        type: String,
        required: [true, 'Video should be included.']
    },
    hiwfvmID: {
        type: String,
        required: true
    }
});

// create mongoose model
const workoutModel = mongoose.model('Workout Videos', workoutSchema);

// export workout model
module.exports = workoutModel;
