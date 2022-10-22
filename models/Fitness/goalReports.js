// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const goalReportsSchema = new mongoose.Schema({
    walking: Number,
    waterDrink: Number,
    calories: Number,

    walked: { type: Number, default: 0 },
    drinked: { type: Number, default: 0 },
    burned: { type: Number, default: 0 },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Home care must contain userId.']
    },
    createdAt: {
        type: Date,
        required: [true, 'Created dated should be included.']
    },
    date: {
        type: Date,
        required: true
    }
});

goalReportsSchema.index({ date: 1, userId: 1 }, { unique: true });

// create mongooose model
const goalsReportsModel = mongoose.model('Goal Reports', goalReportsSchema);

// export model
module.exports = goalsReportsModel;
