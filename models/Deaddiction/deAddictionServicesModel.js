// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// cratea mongoose schema
const deaddictionServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be included.'],
        unique: [true, 'Name should be unique']
    },
    createdAt: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Short description is should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    hiwdasmID: {
        type: String,
        requried: true,
        unique: true
    }
});

// ============================================================
// create mongoose model
const deaddictionServiceModel = mongoose.model(
    'De-addiction Services',
    deaddictionServiceSchema
);

// ============================================================
// export model
module.exports = deaddictionServiceModel;
