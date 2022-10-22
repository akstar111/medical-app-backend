// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const medicalRecordSchema = new mongoose.Schema(
    {
        recordType: {
            type: String,
            required: [true, 'Record type should be included.']
        },
        memberEId: {
            type: String,
            required: [true, 'Member should be included.']
        },
        documentName: {
            type: String,
            required: [true, 'Document name should be included.']
        },
        description: {
            type: String
        },
        report: {
            type: String,
            required: [true, 'Report should be included.']
        },
        createdAt: {
            type: Date,
            required: [true, 'Created Date should be included.']
        },
        issuedDate: {
            type: Date,
            required: [true, 'Date of Report date should be included.']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Medical record must contain userId.']
        },
        hiwmrmID: {
            type: String,
            required: true
        }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);
// crete virtual for poulte
medicalRecordSchema.virtual('member', {
    ref: 'Member',
    localField: 'memberEId',
    foreignField: 'hiwmID'
});
// ============================================================
// create mongoose model
// eslint-disable-next-line prettier/prettier
const medicalRecordModel = mongoose.model(
    'Medical Record',
    medicalRecordSchema
);

// ============================================================
// export mongoose model
module.exports = medicalRecordModel;
