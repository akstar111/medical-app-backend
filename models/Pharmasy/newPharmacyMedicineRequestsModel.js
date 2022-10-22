// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// crete mongoose schema
const pharmacyMedicineRequesterSchema = new mongoose.Schema({
    medicines: {
        type: [Object],
        required: true
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: true
    },
    partnerEId: {
        type: String,
        required: true
    },
    hiwnpmrsmsID: {
        type: String,
        required: [true],
        unique: [true, 'Somehting went wrong please try again.']
    },
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: [true],
        enum: [
            'pending',
            'responded',
            'packed',
            'outofdelivery',
            'completed',
            'missed',
            'canceled'
        ],
        default: 'pending'
    },
    respondedTime: Date,
    packedTime: Date,
    outofdeliveryTime: Date,
    completedTime: Date,
    canceledTime: Date,
    batch: {
        type: String,
        required: true
    }
});

// create mongoose model
const pharmacyMedicineRequesterModel = mongoose.model(
    'Pharmacy Medicine Request',
    pharmacyMedicineRequesterSchema
);

// export mongoose schema
module.exports = pharmacyMedicineRequesterModel;
