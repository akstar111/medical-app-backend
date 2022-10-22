// ============================================================
// import packages
const mongoose = require('mongoose');

// ============================================================
// create schema for create schema
const jobCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true,
        unique: true
    },
    specialists: [String],
    hiwjsmlsmID: {
        type: String,
        required: [true, 'Main id should be included.'],
        unique: [true, 'Something went wrong please try again.']
    },
    createdAt: {
        type: Date,
        required: true
    }
});

// ============================================================
// create model
const jobCategoriesModel = mongoose.model(
    'Job Categories',
    jobCategoriesSchema
);

// ============================================================
// exports model
module.exports = jobCategoriesModel;
