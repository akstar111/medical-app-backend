// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const orderDifferentSchema = new mongoose.Schema({
    productData: {
        productName: {
            type: String
        },
        description: {
            type: String
        },
        meterialType: {
            type: String
        },
        productType: {
            type: String,
            required: [true, 'Product type should be included.'],
            enum: ['wheelchar', 'leg', 'hand', 'support-stick']
        },
        fitType: {
            type: String
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
    hiwdaposID: {
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
    rejectedDate: Date,
    cancelDescription: String,
    deliveredDate: {
        type: Date
    }
});

// ============================================================
// create order hearing model
const orderDifferentlyAbledProductModel = mongoose.model(
    'Order Differently Abled Product',
    orderDifferentSchema
);

// ============================================================
// export order hearing model
module.exports = orderDifferentlyAbledProductModel;
