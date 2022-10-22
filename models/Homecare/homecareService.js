// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const homecareServiceSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        required: [true, 'Date should be included.']
    },
    hiwhcsmID: {
        type: String,
        required: true
    }
});

// create mongoose model
const homecareServiceModel = mongoose.model(
    'Homecare Service Lists',
    homecareServiceSchema
);

// export mongoose schema
module.exports = homecareServiceModel;
