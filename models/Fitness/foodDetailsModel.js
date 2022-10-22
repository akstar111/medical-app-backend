// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name should be included.']
    },
    bannerImage: {
        type: String,
        required: [true, 'Banner Image should be included.']
    },
    calories: {
        type: Number,
        required: [true, 'Calories should be included.']
    },
    uses: {
        type: [String],
        required: [true, 'Uses should be included.']
    },
    createdAt: {
        type: Date,
        required: [true, 'Created dated should be included.']
    },
    hiwfndID: {
        type: String,
        required: true,
        unique: [true, 'Somthing went wrong please try again.']
    }
});

// create mongooose model
const foodNutritionModel = mongoose.model('Food Nutritions', foodSchema);

// export model
module.exports = foodNutritionModel;
