// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const goalsSchema = new mongoose.Schema({
    walking: Number,
    waterDrink: Number,
    calories: Number,

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Home care must contain userId.'],
        unique: true
    },
    createdAt: {
        type: Date,
        required: [true, 'Created dated should be included.']
    }
});

// create mongooose model
const goalsModel = mongoose.model('Goals', goalsSchema);

// export model
module.exports = goalsModel;
