// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const orderHearingSchema = new mongoose.Schema({
    productData: {
        productName: {
            type: String
        },
        description: {
            type: String
        },
        productType: {
            type: String,

            enum: ['OF', 'RIC', 'BTE', 'ITE', 'ITC', 'CIC']
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number
        },
        bannerImage: {
            type: String,
            required: [true, 'Banner image should be included.']
        },
        imageGallery: [String],
        subEId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            requried: true
        }
    },
    createdUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },

    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hearing AID Products'
    },
    productEId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'product must contain userId.']
    },
    addressDetails: {
        type: Object,
        required: [true, 'Product must contain address']
    },
    createdAt: {
        type: Date,
        required: true
    },
    partnerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: [true, 'homecare must contain partner.']
    },
    payment: {
        type: String,
        required: [true, 'Please enter the payment method'],
        default: 'Cash on Delivery'
    },
    hiwonhas: {
        required: true,
        type: String
    },
    orderStatus: {
        type: String,
        required: true,
        enum: [
            'placed',
            'accepted',
            'rejected',
            'shipped',
            'outofdelivery',
            'delivered'
        ],
        default: 'placed'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'delivered', 'canceled', 'rejected'],
        default: 'pending'
    },
    cause: {
        type: String
    },
    acceptedDate: Date,
    shippedDate: Date,
    outOfDeliveryDate: Date,
    canceledDate: Date,
    cancelDescription: String,
    rejectedDate: Date,
    deliveredDate: {
        type: Date
    }
});

// ============================================================
// create order hearing model
const orderHearingaidModel = mongoose.model(
    'Order Hearing Aid',
    orderHearingSchema
);

// ============================================================
// export order hearing model
module.exports = orderHearingaidModel;
