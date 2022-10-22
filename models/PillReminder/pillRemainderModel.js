// ============================================================
// import libraires
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const pillReminderSehema = new mongoose.Schema({
    memberEID: {
        type: String,
        required: [true, 'Members should be included.']
    },
    medicineName: {
        type: String,
        required: [true, 'Medicine should be included.']
    },
    description: {
        type: String,
        required: [true, 'Description should be included.']
    },
    pillImage: {
        type: String,
        required: [true, 'pill image should be included.']
    },
    scheduleDate: {
        scheduleType: {
            type: String,
            enum: ['everyday', 'selectedDay'],
            required: [true, 'Sehedule type should be included.']
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    reminderTime: [
        {
            time: { type: String },
            noofPills: {
                type: Number
            },
            hiwprrtEID: {
                type: String
            }
        }
    ],
    foodType: {
        type: String,
        required: true,
        enum: ['before', 'after']
    },
    intimationPerson: {
        personName: {
            type: String,
            required: [true, 'Person name should be included.']
        },
        personPhone: {
            type: String,
            required: [true, 'Person phone number should be inludedl.']
        },
        personRelation: {
            type: String,
            required: [true, 'Person relateion should be included.']
        }
    },
    sms: {
        type: Boolean,
        required: true,
        default: true
    },
    hiwprmEID: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'reminder must contain userId.']
    },
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
});

// ============================================================
// create model
const pillRemainderModel = mongoose.model('Pill Remainder', pillReminderSehema);

// ============================================================
// export model
module.exports = pillRemainderModel;
