// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const laboratoryCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Name should be unique.'],
        required: [true, 'Name should be included. ']
    },
    description: {
        type: String,
        required: [true, 'Short description is should be included.']
    },
    testType: {
        type: String,
        required: [true, 'Test type should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    createdAt: {
        type: Date,
        required: [true, 'Date should be included.']
    },
    hiwlbycmID: {
        type: String,
        required: true
    }
});

// create mongoose model
const laboratoryCategoryModel = mongoose.model(
    'Laboratory Categories',
    laboratoryCategorySchema
);

// export mongoose schema
module.exports = laboratoryCategoryModel;
