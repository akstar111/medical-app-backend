// ============================================================
// import libraries
const mongoose = require('mongoose');

// ============================================================
// create mongoose schema
const medicalMarketProductOrderSchema = new mongoose.Schema({
    product: {
        name: {
            type: String,
            required: [true, 'name should be included.']
        },
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Medical Market Products',
            required: [true, 'product must contain product id.']
        },
        bannerImage: {
            type: String,
            required: true
        },
        color: {
            type: String
        },
        size: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        discountPrice: {
            type: Number
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    productData: {
        type: Object,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'product must contain userId.']
    },
    address: {
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
        required: [true, 'product must contain partner.']
    },
    payment: {
        type: String,
        required: [true, 'Please enter the payment method'],
        default: 'Cash on Delivery'
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['placed', 'shipped', 'outofdelivery', 'delivered'],
        default: 'placed'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'delivered', 'canceled'],
        default: 'pending'
    },
    cause: String,
    deliveredDate: {
        type: Date
    },
    cancelTime: {
        type: Date
    },
    hiwommpSID: {
        required: true,
        type: String
    }
});

// ============================================================
// create order hearing model
const medicalMarketProductOrderModel = mongoose.model(
    'Medical Market Product Orders',
    medicalMarketProductOrderSchema
);

// ============================================================
// export order hearing model
module.exports = medicalMarketProductOrderModel;
