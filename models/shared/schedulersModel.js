// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schmea
const schedulesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    properties: {
        type: Object,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    uniqueId: {
        type: String,
        required: true
    },
    reminderId: {
        type: String,
        required: true
    },
    hiwasomID: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const scheduleModel = mongoose.model('Schedules', schedulesSchema);

// ============================================================
// exports model
module.exports = scheduleModel;
