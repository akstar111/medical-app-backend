// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const pharmacyMedicineRequestSchema = new mongoose.Schema({
    medicines: {
        type: [Object],
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    hiwpmrmsID: {
        type: String,
        required: [true],
        unique: [true, 'Something went wrong please try again.']
    },
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: [true],
        enum: ['requested', 'responded', 'completed', 'canceled'],
        default: 'requested'
    },
    respondedTime: Date,
    completedTime: Date,
    canceledTime: Date
});

// create mongoose model
const pharmacyMedicineRequestModel = mongoose.model(
    'Pharmacy Medicine Requester',
    pharmacyMedicineRequestSchema
);

// export mongoose schema
module.exports = pharmacyMedicineRequestModel;
