// ============================================================
// import libraries
const { v5: uunidv5, v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import models
const addressModel = require('../models/shared/addUserAddressModel');
const orderHearingaidModel = require('../models/HearingAID/orderHearingAidModel');
const hearingaidModel = require('../models/HearingAID/createHearingAidModel');
const membersModel = require('../models/shared/membersModel');
const userModel = require('../models/shared/userModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const hearingAidProductModel = require('../models/HearingAID/hearingAidProductModel');
const differentlyabledProductModel = require('../models/HearingAID/createDifferentlyAbledProductModel');
const orderDifferentlyAbledProductModel = require('../models/HearingAID/orderDifferentlyAbledProduct');

// ============================================================
// shared
const filerDataFromRequest = (obj, ...allowedFields) => {
    const filterdData = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) filterdData[el] = obj[el];
    });
    return filterdData;
};

// ============================================================
/////////////// Address
// create new address
exports.newAddress = factoryController.createOne(addressModel);

// send json
exports.sendServiceJson = factoryController.sendJson();

// assign new address data
exports.assignNewAddressData = catchAsync(async (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.hiwnusID = await uunidv5(process.env.ADDRESS_SECRET, uuidv4());
    return next();
});

// assign data get all user address
exports.assignDataForGetAllAddress = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// get all user's address
exports.getAllUserAddress = factoryController.findAllData(addressModel);

// send json for get all address model
exports.sendJsonAllAddress = factoryController.sendJsonForAll();

// get address and product data
exports.getProductAddressData = catchAsync(async (req, res, next) => {
    const [address, product] = await Promise.all([
        addressModel.findById(req.params.address),
        hearingaidModel.findById(req.params.id)
    ]);

    if (!address || !product) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }
    return res.status(200).json({ status: 'Success', product, address });
});

// order hearing aid
exports.orderHearingAid = catchAsync(async (req, res, next) => {
    const [address, [product]] = await Promise.all([
        addressModel.findOne({ hiwnusID: req.params.address }),
        hearingAidProductModel.aggregate([
            {
                $match: { hiwhapnsID: req.params.id }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $unwind: '$productDetails.subDetails'
            },

            {
                $match: {
                    'productDetails.color': req.body.color,
                    'productDetails.subDetails.size': req.body.size
                }
            },

            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            },
            {
                $match: {
                    'partner.status': 'accepted'
                }
            }
        ])
    ]);
    console.log(JSON.stringify(product));
    if (!address) {
        return next(new AppError('Please select the valide address', 400));
    }
    if (!product) {
        return next(
            new AppError('Something went wrong with this product', 400)
        );
    }
    let obj = {};
    req.uuid = await uunidv5(process.env.HEARINGAID_SECRET, uuidv4());
    obj = {
        productData: {
            productName: product.productName,
            description: product.description,
            productType: product.productType,
            color: product.productDetails.color,
            bannerImage: product.bannerImage,
            imageGallery: product.imageGallery,
            ...product.productDetails.subDetails,
            quantity: req.body.quantity,
            subEId: product.productDetails.hiwhapdsID
        },
        addressDetails: address,
        createdAt: Date.now(),
        createdUser: product.userId,
        productId: product._id,
        productEId: product.hiwhapnsID,
        userId: req.user._id,
        partnerId: product.partnerId,
        hiwonhas: req.uuid
    };
    const orderhearingaid = await orderHearingaidModel.create(obj);
    if (!orderhearingaid) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// order differently abled product
exports.orderDifferentlyAbledProduct = catchAsync(async (req, res, next) => {
    const [address, [product]] = await Promise.all([
        addressModel.findOne({ hiwnusID: req.params.address }),
        differentlyabledProductModel.aggregate([
            {
                $match: {
                    hiwhapdpID: req.params.id
                }
            },

            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            },
            {
                $match: {
                    'partner.status': 'accepted'
                }
            }
        ])
    ]);

    if (!address) {
        return next(new AppError('Please select the valide address', 400));
    }
    if (!product) {
        return next(new AppError('Product not found.', 400));
    }
    let obj = {};
    if (product.productType !== 'wheelchar') {
        obj.fitType = product.fitType;
    }
    req.uuid = await uunidv5(process.env.HEARINGAID_SECRET, uuidv4());
    obj = {
        productData: {
            productName: product.productName,
            meterialType: product.meterialType,
            description: product.productDescription,
            productType: product.productType,
            price: product.price,
            ...obj,
            discountPrice: product.discountPrice,
            bannerImage: product.bannerImage,
            imageGallery: product.imageGallery,
            quantity: req.body.quantity
        },
        addressDetails: address,
        createdAt: Date.now(),
        createdUser: product.userId,
        productId: product._id,
        productEId: product.hiwhapdpID,
        userId: req.user._id,
        partnerId: product.partnerId,
        hiwdaposID: req.uuid
    };
    const orderhearingaid = await orderDifferentlyAbledProductModel.create(obj);
    if (!orderhearingaid) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});
// assing data for cancel request
exports.assignDataForCancelHearingAidOrderService = (req, res, next) => {
    req.body.status = 'canceled';
    req.body.userResponseDate = Date.now();
    req.updateOneSearch = {
        hiwhapnsID: req.params.orderId,
        userId: req.user._id,
        status: 'pending'
    };
    return next();
};

// assing data for cancel request
exports.assignDataForCancelDifferentlyAbledOrderService = (req, res, next) => {
    req.body.status = 'canceled';
    req.body.userResponseDate = Date.now();
    req.updateOneSearch = {
        hiwdaposID: req.params.orderId,
        userId: req.user._id,
        status: 'pending'
    };
    return next();
};

// cancel hearing aid order
exports.updateHearingAidOrder =
    factoryController.updateOne(orderHearingaidModel);

// cancel differeenlty abled order
exports.updateDifferentlyAbledOrder = factoryController.updateOne(
    orderDifferentlyAbledProductModel
);

// create new members
exports.assignDataForAddNewMembers = catchAsync(async (req, res, next) => {
    req.body = await Promise.all(
        req.body.map(async (el) => {
            const uuid = await Promise.all(
                uunidv5(
                    process.env.MEMBERS_SECRET + Math.random() * Date.now(),
                    uuidv4()
                )
            );
            return {
                // eslint-disable-next-line node/no-unsupported-features/es-syntax
                ...el,
                userId: req.user._id,
                hiwmID: uuid.join(''),
                createdAt: Date.now()
            };
        })
    );

    return next();
});

// add new members
exports.createNewMember = factoryController.createOne(membersModel);

// send json after successfully create new members
exports.sendJsonForAddNewMembers = factoryController.sendJson();

// assign data for update members
exports.assignDataForManageMembers = catchAsync(async (req, res, next) => {
    if (
        req.params.type !== 'family' &&
        req.params.type !== 'doctor' &&
        req.params.type
    ) {
        return next(new AppError('Please select the valid Relation type', 400));
    }

    const datas = await membersModel.updateMany(
        {
            userId: req.user._id,
            type: req.params.type
        },
        [
            {
                $set: {
                    select: {
                        $eq: ['$hiwmID', req.params.memberId]
                    }
                }
            }
        ],
        {
            multi: true
        }
    );

    if (!datas.matchedCount) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    // return next();
    return res.status(200).json({
        status: 'Success'
    });
});

// update members
exports.updateMembers = factoryController.updateOne(membersModel);

// assign data for get members
exports.assignDataForGetMember = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// get all user
exports.getAllmember = factoryController.findAllData(membersModel);

// send json for update one
exports.sendJsonForUpdateMembers = factoryController.sendJsonForUpdateOne();

// assign data for delete members
exports.deleteMember = catchAsync(async (req, res, next) => {
    const deleteMember = await membersModel.deleteOne({
        hiwmID: req.params.memberId,
        userId: req.user._id
    });

    if (!deleteMember.deletedCount) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    return res.status(200).json({
        status: 'Success'
    });
});

exports.checkJob = (req, res, next) => {
    const status = schedule.scheduledJobs[req.params.serviceId];

    return res.json({ status: !!status });
};

// assign data for delete a addresss
exports.assignDataForDeleteOne = (req, res, next) => {
    req.searchQuery = { hiwnusID: req.params.addressId, userId: req.user._id };
    return next();
};

// delete address
exports.deleteOneAddress = factoryController.deleteOne(addressModel);

// send json for delete one address
exports.sendJsonForDeleteOne = factoryController.sendJsonForDeleteOne();

// assign data for update user
exports.assignDataForUpdateUser = (req, res, next) => {
    req.updateOneSearch = {
        _id: req.user._id
    };
    return next();
};

// update user
exports.updateUser = factoryController.updateOne(userModel);

// send json for updateone
exports.sendJsonforUpdateOne = factoryController.sendJsonForUpdateOne();

// send json for get user
exports.sendJsonForGetUser = (req, res) =>
    res.status(200).json({
        status: 'Success',
        docs: req.user
    });
