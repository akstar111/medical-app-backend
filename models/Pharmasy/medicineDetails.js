// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const medicinesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Name should be unique.'],
        required: [true, 'Name should be included. ']
    },
    description: {
        type: String,
        required: [true, 'Short description is should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    price: {
        type: Number
    },
    categorie: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: [true, 'Date should be included.']
    },
    hiwpmmdsID: {
        type: String,
        required: true
    }
});

// create mongoose model
const medicinesModel = mongoose.model(
    'Pharmacy Medicines List',
    medicinesSchema
);

// export mongoose schema
module.exports = medicinesModel;
