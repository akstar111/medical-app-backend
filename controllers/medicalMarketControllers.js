// ============================================================
// import models
const { default: mongoose } = require('mongoose');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');

// ============================================================
// import models
const medicalMarketList = require('../models/MedicalMarket/medicalMarketListModel');
const partnerModel = require('../models/shared/partnerModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const marketReviewModel = require('../models/MedicalMarket/medicalMarketProductReviewModel');
const medicalMarketProductCartModel = require('../models/MedicalMarket/medicalMarketProductCartModel');
const medicalMarketProductWishlistModel = require('../models/MedicalMarket/medicalMarketProductWishlistModel');
const addressModel = require('../models/shared/addUserAddressModel');
const medicalMarketProductOrderModel = require('../models/MedicalMarket/orderMedicalMarketProductModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const medicalMarketServiceProviderModel = require('../models/MedicalMarket/medicalMarketServiceProviderModel');

// ============================================================
// create controllers
// assign data for create new medical market service
exports.assignDataForCreateNewMedicalMarketList = catchAsync(
    async (req, res, next) => {
        req.body.hiwmmlID = await encryptID(process.env.MEDICAL_MARKET_SECRET);
        req.body.createdAt = Date.now();
        return next();
    }
);

// create new homecare service
exports.createNewMedicalMarketList =
    factoryControllers.createOne(medicalMarketList);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// get all homecare service
exports.getAllMedicalMarketServices =
    factoryControllers.getAll(medicalMarketList);

// send json for get all data
exports.sendJsonAllData = factoryControllers.sendJsonForFindAll();

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await medicalMarketList.findOne({
        hiwmmlID: req.params.serviceId
    });
    if (!data) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }

    req.oldName = data.name;
    return next();
});
// assign data for update MedicalMarket service
exports.assignDataForUpdateMedicalMarketService = (req, res, next) => {
    req.updateOneSearch = { hiwmmlID: req.params.serviceId };
    return next();
};

// assign data for update all MedicalMarket services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};

// verify new homecare service
exports.verifyMedicalMarketProductService = catchAsync(
    async (req, res, next) => {
        const [partner] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Medical Market'
            }),
            medicalMarketList.findOne({
                name: req.body.serviceName
            })
        ]);

        if (!partner) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    401
                )
            );
        }

        req.body.userId = req.user._id;
        req.body.createdAt = Date.now();
        req.body.partnerId = partner._id;
        req.body.sellerName = req.user.name;
        req.body.hiwmmpmID = await encryptID(process.env.MEDICAL_MARKET_SECRET);
        return next();
    }
);

// assign data for update medicalmarket product
exports.assignDataForUpdateMedicalMarketProducts = (req, res, next) => {
    req.updateOneSearch = { hiwhcsmID: req.params.serviceId };
    return next();
};

// update MedicalMarket service
exports.updateMedicalMarket = factoryControllers.updateOne(medicalMarketList);

// update other homecare service data
exports.updateRemainingHomeCareServices = factoryControllers.updateAll(
    medicalMarketProductsModel
);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });

// create new service
exports.createNewService = factoryControllers.createOne(
    medicalMarketProductsModel
);

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Medical Market'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// assign partner search data
exports.assignDataForUpdateMedicalMarket = (req, res, next) => {
    req.updateByIdQuery = {
        userId: req.user._id,
        hiwmmpmID: req.params.serviceid
    };

    return next();
};

// update medicalmarket service
exports.updateHomeCareService = factoryControllers.updateOne(
    medicalMarketProductsModel
);

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// delete homecare service
exports.deleteMedicalMarketService = catchAsync(async (req, res, next) => {
    const data = await medicalMarketProductsModel.deleteOne({
        userId: req.user._id,
        hiwmmpmID: req.params.serviceId
    });
    if (!data.deletedCount) {
        return next(
            new AppError(
                'Something went wrong while proessing your request',
                400
            )
        );
    }
    return next();
});

// get all servie
exports.getAllMedicalMarketProduct = factoryControllers.getAllFilter(
    medicalMarketProductsModel
);

// send json for all
exports.sendJsonAll = factoryControllers.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwonsmID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -marketId'
        },
        {
            path: 'partner',
            select: 'status'
        }
    ];
    return next();
};

// find data by id
exports.findServiceById = factoryControllers.findOneWithPopulate(
    medicalMarketProductsModel
);

// send json for find one with populate
exports.sendJsonForPopulateOne =
    factoryControllers.sendJsonForFindOneWithPopulate();

// assign data for get a service
exports.assignGetAMarketData = (req, res, next) => {
    req.searchQuery = { hiwmmpmID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -marketId'
        }
    ];
    return next();
};

// assign data for market product reivews
exports.assingDMarketData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        marketId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            marketId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createOpticalsReview = factoryControllers.upsertOne(marketReviewModel);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await marketReviewModel.aggregate([
        {
            $match: {
                marketId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$opticalsId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await medicalMarketProductsModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].length
            }
        );
    } else {
        await medicalMarketProductsModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            }
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assing data for add new cart
exports.verifyProductandcheckuser = catchAsync(async (req, res, next) => {
    const [product, cartUser] = await Promise.all([
        medicalMarketProductsModel.findOne({ hiwmmpmID: req.params.productId }),
        medicalMarketProductCartModel.exists({
            userId: req.user._id,
            productEID: req.params.productId
        })
    ]);

    if (!product) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    if (cartUser) {
        return next(new AppError('This Product is already is your list', 400));
    }

    req.body.userId = req.user._id;
    req.body.productEID = product.hiwmmpmID;
    req.body.productId = product._id;
    req.body.productType = product.productType;
    req.body.hiwmmpcsID = await encryptID(process.env.MEDICAL_MARKET_SECRET);
    return next();
});

// create new cart
exports.createNewCart = factoryControllers.createOne(
    medicalMarketProductCartModel
);

// assin data for update cart
exports.assigndataForUpdateMarketProductCart = (req, res, next) => {
    req.updateOneSearch = {
        hiwmmpcsID: req.params.productId,
        userId: req.user._id
    };
    return next();
};

// update product cart
exports.updateProductCart = factoryControllers.updateOne(
    medicalMarketProductCartModel
);

// delete cart
exports.deleteMarketProductCart = catchAsync(async (req, res, next) => {
    const cart = await medicalMarketProductCartModel.findOneAndDelete({
        hiwmmpcsID: req.params.productId,
        userId: req.user._id
    });
    if (!cart) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    return res.status(200).json({
        status: 'Success'
    });
});

// assing data for add new cart
exports.verifyProductandcheckuserWishlist = catchAsync(
    async (req, res, next) => {
        const [product, wishUser] = await Promise.all([
            medicalMarketProductsModel.findOne({
                hiwmmpmID: req.params.productId
            }),
            medicalMarketProductWishlistModel.exists({
                userId: req.user._id,
                productEID: req.params.productId
            })
        ]);

        if (!product) {
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    401
                )
            );
        }
        if (wishUser) {
            return next(
                new AppError('This Product is already is your list', 400)
            );
        }

        req.body.userId = req.user._id;
        req.body.productEID = product.hiwmmpmID;
        req.body.productId = product._id;

        req.body.hiwmmpwlID = await encryptID(
            process.env.MEDICAL_MARKET_SECRET
        );
        return next();
    }
);

// create new cart
exports.createNewWhishlist = factoryControllers.createOne(
    medicalMarketProductWishlistModel
);

// delete cart
exports.deleteMarketProductCart = catchAsync(async (req, res, next) => {
    const cart = await medicalMarketProductWishlistModel.findOneAndDelete({
        hiwmmpwlID: req.params.productId,
        userId: req.user._id
    });
    if (!cart) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    return res.status(200).json({
        status: 'Success'
    });
});

// assign data for check valide wishlist and user
exports.assignDataForCheckValidMarketWishlist = (req, res, next) => {
    req.searchQuery = {
        hiwmmpwlID: req.params.productId,
        userId: req.user._id
    };
    return next();
};

// find wishlist
exports.findOneMarketPlaceProductWishlist = factoryControllers.findOne(
    medicalMarketProductWishlistModel
);

// check cart and wishlish data
exports.checkWishListandCartinMarketProduct = catchAsync(
    async (req, res, next) => {
        const [cart, product] = await Promise.all([
            medicalMarketProductCartModel.findOne({
                productEID: req.docs.productEID,
                userId: req.user._id
            }),
            medicalMarketProductsModel.findOne({
                hiwmmpmID: req.docs.productEID
            })
        ]);

        if (cart) {
            return next(
                new AppError('This product already in your cart.', 403)
            );
        }
        if (!product) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }

        req.body.userId = req.user._id;
        req.body.productEID = product.hiwmmpmID;
        req.body.productId = product._id;
        req.body.productType = product.productType;
        req.body.hiwmmpcsID = await encryptID(
            process.env.MEDICAL_MARKET_SECRET
        );

        const [carts, wishlist] = await Promise.all([
            medicalMarketProductCartModel.create(req.body),
            medicalMarketProductWishlistModel.findByIdAndDelete(req.docs._id)
        ]);
        if (!carts || !wishlist) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }
        return res.status(202).json({
            status: 'Success'
        });
    }
);

// medical market product order
exports.orderMedicalMarketProduct = catchAsync(async (req, res, next) => {
    const [address, product] = await Promise.all([
        addressModel.findOne({
            hiwnusID: req.params.address,
            userId: req.user._id
        }),
        medicalMarketProductsModel.findOne({
            hiwmmpmID: req.params.id
        })
    ]);

    if (!address || !product) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }

    if (product.productType === 'variable') {
        let subdata = [];
        if (!req.body.color) {
            return next(
                new AppError('Please select the proper color of the product')
            );
        }
        let [data] = await Promise.all(
            product.productDetails.filter((el) => {
                if (el.color === req.body.color) {
                    return true;
                }
            })
        );

        if (!data) {
            return next(
                new AppError('Please select the proper color of the product')
            );
        }
        subdata = data.availableSize[0];
        if (!req.body.size && data.availableSize[0].size) {
            return next(
                new AppError('Please select the proper size of the product')
            );
        }
        if (data.availableSize[0].size) {
            subdata = await Promise.all(
                data.availableSize.filter((el) => el.size === req.body.size)
            );
            if (!subdata.length) {
                return next(
                    new AppError('Please select the proper size of the product')
                );
            }
        }
        data.availableSize = subdata;
        req.query.property = {
            color: data.color || false,
            size: data.availableSize[0].size || false,
            price: data.availableSize[0]?.price || false,
            discountPrice: data.availableSize[0].discountPrice || false,
            coverImage: data.availableSize[0].coverImage || false,
            imageGallery: data.availableSize[0].imageGallery || false
        };
    } else {
        req.query.property.price = product.price;
        reqreq.query.property.discountPrice = product.discountPrice;
    }

    const upsertOne = await medicalMarketProductCartModel.findOneAndUpdate(
        {
            userId: req.user._id,
            productEID: req.params.id,
            productId: product._id
        },
        {
            userId: req.user._id,
            productEID: req.params.id,
            productId: product._id,
            quantity: req.body.quantity,
            productType: product.productType,
            color: req.body.color,
            size: req.body.size,
            hiwmmpcsID: await encryptID(process.env.MEDICAL_MARKET_SECRET),
            createdAt: Date.now()
        },
        {
            upsert: true,
            returnNewDocument: true,
            runValidators: true
        }
    );
    // console.log(upsertOne);
    let obj = {};
    req.uuid = await encryptID(process.env.MEDICAL_MARKET_SECRET);
    obj = {
        product: {
            name: product.name,
            productId: product._id,
            bannerImage: product.coverImage,
            color: req.body.color,
            size: req.body.size,
            price: req.query.property.price,
            discountPrice: req.query.property.discountPrice,
            quantity: upsertOne.quantity
        },
        address,
        createdAt: Date.now(),
        productData: product,
        userId: req.user._id,
        partnerId: product.partnerId,
        hiwommpSID: req.uuid
    };
    const orderMarketProduct = await medicalMarketProductOrderModel.create(obj);
    if (!orderMarketProduct) {
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
exports.assignDataForCancelMarketProductOrderService = (req, res, next) => {
    const bodydata = req.body.cause;
    req.body = {};
    req.body.status = 'canceled';
    req.body.cause = bodydata;
    req.body.cancelTime = Date.now();
    req.updateOneSearch = {
        hiwommpSID: req.params.orderId,
        userId: req.user._id,
        status: { $ne: 'canceled' }
    };
    return next();
};

exports.cancelMedicalMarketOrder = factoryControllers.updateOne(
    medicalMarketProductOrderModel
);

// send json status of homecare cancel requiest
exports.sendJsonforUpdateOne = factoryControllers.sendJsonForUpdateOne();

// get data for vendors and products
exports.getDataForQuote = catchAsync(async (req, res, next) => {
    const docs = await Promise.all(
        req.body.map(async (el) => {
            const uuid = await encryptID(process.env.MEDICAL_MARKET_SECRET);

            const datas = await medicalMarketProductsModel.aggregate([
                {
                    $match: {
                        productStream: 'stethoscope'
                    }
                },
                {
                    $group: { _id: '$partnerId' }
                },
                {
                    $lookup: {
                        from: 'partners',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'partners'
                    }
                },
                {
                    $unwind: '$partners'
                },
                {
                    $match: { 'partners.status': 'accepted' }
                },
                {
                    $group: {
                        _id: '$partners._id'
                    }
                }
            ]);

            return await Promise.all(
                datas.map(async (els) => {
                    console.log(els);
                    const reqs = {
                        productName: el.productName,
                        proposalDate: el.proposalDate,
                        productDescription: el.productDescription,
                        quantity: el.quantity,
                        hiwmmqrrsID: await encryptID(
                            process.env.MEDICAL_MARKET_SECRET
                        ),

                        userId: req.user._id,
                        for: uuid,
                        requestPartner: els._id,
                        createdAt: Date.now()
                    };
                    return await Promise.all([
                        medicalMarketQuoteRequesterModel.create(reqs)
                    ]);
                })
            );
        })
    );

    const check = docs.some((el) => !!el);
    if (!check) {
        return next(
            new AppError('No related vendors found in your serach', 404)
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// cancel requester request
exports.assignDataForCancelReques = catchAsync(async (req, res, next) => {
    req.updateAllSearchQuery = {
        for: req.params.quoteId,
        userId: req.user._id,
        from: 'Medical Market'
    };
    req.updateAllData = {
        proposeStatus: 'canceled',
        userActionDate: Date.now()
    };
    return next();
});

// respont quote status
exports.assignDataForQuotesRequests = (req, res, next) => {
    req.updateOneSearch = {
        hiwmmqrrsID: req.params.quoteId,
        userId: req.user._id,
        from: 'Medical Market',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// cancel requerster
exports.updateMedcalquoterequestor = factoryControllers.updateOne(
    medicalMarketQuoteRequesterModel
);
// cancel quote
exports.updateMedcalquoterequestors = factoryControllers.updateAll(
    medicalMarketQuoteRequesterModel
);

// assign data for upate vendor
exports.assigndataForUpdateQuote = (req, res, next) => {
    req.updateOneSearch = {
        hiwmmqrrsID: req.params.quoteId,
        requestPartner: req.docs._id,
        proposeStatus: 'requested'
    };
    if (req.body.status === 'rejected-by-vendor') {
        req.body = { status: 'rejected-by-vendor' };
    }
    req.body.vendorActionDate = Date.now();
    return next();
};

// order products form cart
exports.orderMedicalMarketProductViaCart = catchAsync(
    async (req, res, next) => {
        const address = await addressModel.findOne({
            hiwnusID: req.params.address,
            userId: req.user._id
        });

        const obj = [];

        const docs = await Promise.all(
            req.body.cartIds.map(async (el) => {
                const cart = await medicalMarketProductCartModel.findOne({
                    hiwmmpcsID: el,
                    userId: req.user._id
                });

                if (!cart) {
                    return next(
                        new AppError(
                            'Somthing went wrong while processing your request.',
                            400
                        )
                    );
                }
                const product = await medicalMarketProductsModel.findById(
                    cart.productId
                );
                if (cart.productType === 'variable') {
                    let subdata = [];

                    if (!cart.color) {
                        return next(
                            new AppError(
                                'Please select the proper color of the product'
                            )
                        );
                    }
                    let [data] = await Promise.all(
                        product.productDetails.filter((els) => {
                            if (els.color === cart.color) {
                                return true;
                            }
                        })
                    );

                    if (!data) {
                        return next(
                            new AppError(
                                'Please select the proper color of the product'
                            )
                        );
                    }
                    subdata = data.availableSize[0];
                    if (!cart.size && data.availableSize[0].size) {
                        return next(
                            new AppError(
                                'Please select the proper size of the product'
                            )
                        );
                    }
                    if (data.availableSize[0].size) {
                        subdata = await Promise.all(
                            data.availableSize.filter(
                                (els) => els.size === cart.size
                            )
                        );
                        if (!subdata.length) {
                            return next(
                                new AppError(
                                    'Please select the proper size of the product'
                                )
                            );
                        }
                    }
                    data.availableSize = subdata;
                    req.query.property = {
                        color: data.color || false,
                        size: data.availableSize[0].size || false,
                        price: data.availableSize[0]?.price || false,
                        discountPrice:
                            data.availableSize[0].discountPrice || false,
                        coverImage: data.availableSize[0].coverImage || false,
                        imageGallery:
                            data.availableSize[0].imageGallery || false
                    };
                } else {
                    req.query.property = {
                        price: product.price,
                        discountPrice: product.discountPrice
                    };
                }

                req.uuid = await encryptID(process.env.MEDICAL_MARKET_SECRET);
                let updateObj = {
                    product: {
                        name: product.name,
                        productId: product._id,
                        bannerImage: product.coverImage,
                        color: cart.color,
                        size: cart.size,
                        price: req.query.property.price,
                        discountPrice: req.query.property.discountPrice,
                        quantity: cart.quantity
                    },
                    address,
                    createdAt: Date.now(),
                    productData: product,
                    userId: req.user._id,
                    partnerId: product.partnerId,
                    hiwommpSID: req.uuid
                };

                obj.push(updateObj);
                return true;
            })
        );
        const orderMarketProduct = await medicalMarketProductOrderModel.create(
            obj
        );

        const check = docs.some((el) => !el);
        if (check || !orderMarketProduct) {
            return next(
                new AppError(
                    'Something went wrong while porcessing your request',
                    400
                )
            );
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// get my active quoetes
exports.getMyActiveQuotes = catchAsync(async (req, res, next) => {
    const quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                from: req.body.from,
                $and: [
                    {
                        proposeStatus: { $ne: 'completed' }
                    },
                    {
                        proposeStatus: { $ne: 'canceled' }
                    }
                ]
            }
        },
        {
            $group: {
                _id: '$for',
                productName: { $first: '$productName' },
                proposalDate: { $first: '$proposalDate' },
                productDescription: { $first: '$productDescription' },
                quantity: { $first: '$quantity' }
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: req.body.from
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'requestPartner',
                foreignField: '_id',
                as: 'partners'
            }
        },
        {
            $unwind: '$partners'
        },
        {
            $project: {
                _id: 1,
                productName: 1,
                proposalDate: 1,
                productDescription: 1,
                quantity: 1,
                proposeStatus: 1,
                createdAt: 1,
                'partners.name': 1
            }
        }
    ]);
    quotes = await Promise.all(
        quotes.map((el) => {
            return { ...el, _id: undefined };
        })
    );
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// get partner and produt names
exports.getProductList = catchAsync(async (req, res, next) => {
    const [names, [request]] = await Promise.all([
        medicalMarketProductsModel.find().distinct('productStream'),
        medicalMarketQuoteRequesterModel.aggregate([
            {
                $facet: {
                    request: [
                        {
                            $match: {
                                userId: req.user._id,
                                proposeStatus: 'requested',
                                from: req.query.from
                            }
                        },
                        {
                            $group: {
                                _id: '$for',
                                productName: { $first: '$productName' },
                                quantity: { $first: '$quantity' },
                                proposalDate: { $first: '$proposalDate' },
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { proposalDate: -1 }
                        }
                    ],
                    activeList: [
                        {
                            $match: {
                                userId: req.user._id,
                                $or: [
                                    { proposeStatus: 'requested' },
                                    { proposeStatus: 'proposal-submited' },
                                    { proposeStatus: 'accepted' }
                                ],
                                from: req.query.from
                            }
                        },
                        {
                            $group: {
                                _id: '$for',
                                productName: { $first: '$productName' },
                                quantity: { $first: '$quantity' },
                                proposalDate: { $first: '$proposalDate' },
                                productDescription: {
                                    $first: '$productDescription'
                                },
                                total: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { proposalDate: -1 }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                userId: req.user._id,
                                from: req.query.from,
                                $or: [
                                    { proposeStatus: 'rejected-by-user' },
                                    { proposeStatus: 'completed' }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'partners',
                                localField: 'requestPartner',
                                foreignField: '_id',
                                pipeline: [{ $project: { name: 1 } }],
                                as: 'partner'
                            }
                        },
                        {
                            $unwind: '$partner'
                        }
                    ]
                }
            }
        ])
    ]);
    req.body.history = request.history;
    req.body.request = request.request;
    req.body.activeList = request.activeList;
    req.body.names = names;
    return next();
});

// get top 3 lowest quotes
exports.getTop3LowestQuotes = catchAsync(async (req, res, next) => {
    let obj = {};
    if (req.originalUrl.startsWith('/vendor/blood-bank/quotes/lowest-quotes')) {
        obj = {
            for: req.params.batchId,
            $or: [
                { proposeStatus: 'proposal-submited' },
                { proposeStatus: 'accepted' }
            ]
        };
    } else if (req.originalUrl.startsWith('/vendor/blood-bank/get-a-quote/')) {
        obj = {
            hiwmmqrrsID: req.params.quoteId
        };
    }

    const lowest = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                from: req.query.from,
                ...obj
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'requestPartner',
                foreignField: '_id',
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        },
        {
            $group: {
                _id: '$estimateCost',
                partners: {
                    $push: {
                        proposal: '$hiwmmqrrsID',
                        partner: '$partner.name',
                        vendorActionDate: '$vendorActionDate',
                        productName: '$productName',
                        proposalDate: '$proposalDate',
                        productDescription: '$productDescription',
                        quantity: '$quantity',
                        proposeStatus: '$proposeStatus',
                        estimateCost: '$estimateCost'
                    }
                }
            }
        },
        {
            $sort: { _id: 1 }
        },
        { $limit: 3 }
    ]);
    req.body.lowest = lowest;
    return next();
});

// filter new blood bank data
exports.filterMedicalMarketStoreData = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'contactPersonName',
            'contactPersonPhone',
            'email',
            'storePhone',
            'landline',
            'openTime',
            'closeTime',
            'location',
            'address'
        )
    ]);
    return next();
});
// assign data for update medical market
exports.assignDataForUpdatMedicalMarketServiceProvider = (req, res, next) => {
    req.updateOneSearch = { userId: req.user._id, partnerId: req.docs._id };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
};

// update medicalmarket service provider
exports.updateMedicalMarketServiceProvider = factoryControllers.updateOne(
    medicalMarketServiceProviderModel
);

// check the partner and councilar
exports.checkValidVendorandPartnerMedicalMarket = catchAsync(
    async (req, res, next) => {
        const [partner] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Medical Market'
            })
        ]);

        if (!partner) {
            return next(
                new AppError('Please verify or create partner service.', 400)
            );
        }

        // console.log(req.body);
        req.body.userId = req.user._id;
        req.body.partnerId = partner._id;
        req.body.createdAt = Date.now();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.body.storeName = partner.company;
        req.body.storeEmail = partner.email;
        req.body.hiwmmspmID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        return next();
    }
);

// create new medical market store
exports.createNewMedicalMarketStore = factoryControllers.createOne(
    medicalMarketServiceProviderModel
);
// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// get bloodbank and partner
exports.getPartneranMarket = catchAsync(async (req, res, next) => {
    const [partner, market] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'Medical Market',
            status: 'accepted'
        }),
        medicalMarketServiceProviderModel.findOne({
            userId: req.user._id
        })
    ]);
    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }

    req.query.from = 'Medical Market';
    req.body.partner = partner;
    req.body.market = market;
    return next();
});

// get all valid products
exports.assignDataForGetProducts = (req, res, next) => {
    req.searchQuery = {};
    req.queryPopulate = [
        {
            path: 'partner',
            select: 'status'
        }
    ];
    return next();
};

// get all products
exports.getAllProduct =
    factoryControllers.getFindAllWithPopulateElemMatchFilter(
        medicalMarketProductsModel
    );

// sennd jfon for get all filtter with populate
exports.sendJsonForFindAllWithPopulate = factoryControllers.sendAllFilter();

// assign data for my product
exports.getMyProducts = catchAsync(async (req, res, next) => {
    const products = await medicalMarketProductsModel.find({
        userId: req.user._id
    });
    req.body.product = products;
    return next();
});

//
