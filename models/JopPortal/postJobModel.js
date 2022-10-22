// ============================================================
// import packages
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// mongoose schema
const postJobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: [true, 'Job title should be included.']
        },
        yearOfExperience: {
            type: Number,
            required: [true, 'Year of Experience should be included.']
        },
        category: {
            type: String,
            required: true
        },
        speciality: {
            type: String,
            required: true
        },
        salaryPerMonth: {
            type: Number,
            required: [true, 'Salary details should be included.']
        },
        vacancy: {
            type: Number,
            required: [true, 'Vacancy should be included.']
        },
        description: {
            type: String,
            required: [true, 'Description should be included.']
        },
        address: {
            type: String,
            required: [true, 'Address should be included.']
        },
        city: {
            type: String,
            required: [true, 'City should be included.']
        },
        state: {
            type: String,
            required: [true, 'State should be included.']
        },
        country: {
            type: String,
            required: [true, 'country should be included.']
        },
        pincode: {
            type: Number,
            required: [true, 'pincode should be included.']
        },
        jobType: {
            type: String,
            required: [true, 'Job type Should be included.'],
            enum: ['Part-Time', 'Full-Time']
        },
        phone: {
            type: String,
            required: [true, 'phone should be included.']
        },
        bannerImage: {
            type: String,
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        workTimeFrom: {
            type: String,
            required: [true, 'Work start time should be included.']
        },
        workTimeTo: {
            type: String,
            required: [true, 'Work end time should be included.']
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        expiredOn: {
            type: Date,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Job must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner'
        },
        partnerEID: {
            type: String
        },
        partner: {
            type: Boolean,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inActive'],
            default: 'active'
        },
        hiwjbmID: {
            type: String,
            required: true
        }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtula populate
postJobSchema.virtual('applicants', {
    ref: 'Job Apply',
    foreignField: 'jobEId',
    localField: 'hiwjbmID'
});
// virtula populate partner
postJobSchema.virtual('partnerDetails', {
    ref: 'Partner',
    foreignField: '_id',
    localField: 'partnerId'
});

// ============================================================
// create model
const postJobModel = mongoose.model('Jobs', postJobSchema);

// ============================================================
// export model
module.exports = postJobModel;
