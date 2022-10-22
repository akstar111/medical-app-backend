const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const ApiFeature = require('../util/apiFeatures');

// create one new document
exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.create(req.body);
        req.body.docs = docs;
        return next();
    });

// send json to the client
exports.sendJson = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.docs
        })
    );

// find one data
exports.findOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.findOne(req.searchQuery);
        if (!docs) {
            return next(
                new AppError(
                    'There are no available service for this service.',
                    404
                )
            );
        }
        req.docs = docs;
        req.searchQuery = {};
        return next();
    });

exports.sendJsonForFindOne = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.docs
        })
    );
// update modey by id
exports.updateById = (Model) =>
    catchAsync(async (req, res, next) => {
        const uDocs = await Model.findByIdAndUpdate(
            req.updateByIdQuery,
            req.updateQuery,
            {
                new: true,
                runValidators: true
            }
        );

        if (!uDocs) {
            return next(
                new AppError(
                    'Something went wrong while processing your resquest.',
                    400
                )
            );
        }
        req.uDocs = uDocs;
        return next();
    });

// send json for update by ud
exports.sendJsonForUpdatedById = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success'
        })
    );

// update by update query
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const UOdocs = await Model.updateOne(req.updateOneSearch, req.body, {
            new: true,
            runValidators: true
        });
        console.log(req.updateOneSearch);
        if (!UOdocs.matchedCount) {
            return next(
                new AppError(
                    'Something went wrong while processing your resquest.',
                    400
                )
            );
        }

        req.body.UOdocs = UOdocs;
        return next();
    });
exports.sendJsonForUpdateOne = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.UOdocs
        })
    );

// find all by search query
exports.findAllData = (Model) =>
    catchAsync(async (req, res, next) => {
        const findDocs = await Model.find(req.searchQuery);
        if (!findDocs) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }
        req.body.findDocs = findDocs;
        req.searchQuery = {};
        return next();
    });

// send json for all data receiving
exports.sendJsonForAll = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findDocs
        })
    );

// find by id
exports.findById = (Model) =>
    catchAsync(async (req, res, next) => {
        const findByIdDocs = await Model.findById(req.searchQueryId);

        if (!findByIdDocs) {
            return next(
                new AppError(
                    'Something went wrong while processing your resquest.',
                    400
                )
            );
        }

        req.searchQueryId = {};
        req.body.findByIdDocs = findByIdDocs;
        return next();
    });

// json for findby id
exports.sendJsonForId = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findByIdDocs
        })
    );

// get all data with class filter
exports.getAllFilter = (Model) =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(Model.find(), req.query)
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        const product = await apiClass.query;

        req.body.findAllFilter = product;
        return next();
    });

exports.getFindAllFilter = (Model) =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(Model.find(req.searchQuery), req.query)
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        const product = await apiClass.query;

        req.body.findAllFilter = product;
        return next();
    });
exports.getFindAllFilterWithSelectedFields = (Model) =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(
            Model.find(req.searchQuery).select(req.selectedData),
            req.query
        )
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        const product = await apiClass.query;

        req.body.findAllFilter = product;
        return next();
    });
exports.getFindAllWithPopulateFilter = (Model) =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(
            Model.find(req.searchQuery).populate(req.queryPopulate),
            req.query
        )
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        const product = await apiClass.query;
        req.body.findAllFilter = product;
        return next();
    });
exports.getFindAllWithPopulateElemMatchFilter = (Model) =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(
            Model.find(req.searchQuery).populate(req.queryPopulate),
            req.query
        )
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        let product = await apiClass.query;
        product = await Promise.all(
            product.filter((el) => {
                return el.partner[0]?.status === 'accepted';
            })
        );
        req.body.findAllFilter = product;
        return next();
    });

// send all filter data
exports.sendAllFilter = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findAllFilter
        })
    );

// find all with seletected data
exports.findAllWithQueryAndSelectdData = (Model) =>
    catchAsync(async (req, res, next) => {
        const findAllWithSelectedData = await Model.find(
            req.filterQuery
        ).select(req.selectedata);
        req.body.findAllWithSelectdData = findAllWithSelectedData;
        req.selectedata = '';
        return next();
    });

// send json for find all with selected data
exports.sendJsonForAllWithSelected = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body
        })
    );

// find all data
exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        req.body = {};
        const getAllData = await Model.find();

        req.body.getAllData = getAllData;
        return next();
    });

// send json for find all data
exports.sendJsonForFindAll = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.getAllData
        })
    );

// upsert document
exports.upsertOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const upsertOne = await Model.findOneAndUpdate(
            req.upsertQuery,
            req.upsertDoc,
            {
                upsert: true,
                returnNewDocument: true,
                runValidators: true
            }
        );

        req.body.upsertOne = upsertOne;
        return next();
    });

// send jsong for upsert
exports.sendJsonForUpsertOne = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.upsertOne
        })
    );

// find all with populate
exports.findByIdWithPopulate = (Model) =>
    catchAsync(async (req, res, next) => {
        const findPopulateDocs = await Model.findById(req.searchQuery).populate(
            req.queryPopulate
        );
        if (!findPopulateDocs) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }

        req.body.findPopulateDocs = findPopulateDocs;
        req.searchQuery = {};
        req.queryPopulate = {};
        return next();
    });

// send jsonf for find all data with populate
exports.sendJsonForAPopulate = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findPopulateDocs
        })
    );

// findone wiht populate
exports.findOneWithPopulate = (Model) =>
    catchAsync(async (req, res, next) => {
        const findPopulateDocs = await Model.findOne(req.searchQuery)
            .populate(req.queryPopulate)
            .lean();

        if (!findPopulateDocs) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }

        req.body.findOnePopulateDocs = findPopulateDocs;
        req.searchQuery = {};
        req.queryPopulate = {};
        return next();
    });

// json for get one with populate
exports.sendJsonForFindOneWithPopulate = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findOnePopulateDocs
        })
    );

// find wiht populate
exports.findWithPopulate = (Model) =>
    catchAsync(async (req, res, next) => {
        const findPopulateDocs = await Model.find(req.searchQuery)
            .populate(req.queryPopulate)
            .skip(req.query.skip ?? 0);

        if (!findPopulateDocs) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }

        req.body.findOnePopulateDocs = findPopulateDocs;
        req.searchQuery = {};
        req.queryPopulate = {};
        return next();
    });

// json for get one with populate
exports.sendJsonForFindWithPopulate = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.body.findOnePopulateDocs
        })
    );

// update all data
exports.updateAll = (Model) =>
    catchAsync(async (req, res, next) => {
        await Model.updateMany(req.updateAllSearchQuery, req.updateAllData, {
            new: true,
            runValidators: true
        });

        req.updateAllSearchQuery = undefined;
        req.updateAllData = undefined;
        return next();
    });
// send json fro updatea all
exports.sendJsonForUpdateAll = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success'
        })
    );
// exprots find one with selected data
exports.findOneWithSelectedData = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.findOne(req.searchQuery)
            .select(req.selectedData ?? '')
            .lean();
        console.log(req.searchQuery);
        if (!docs) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }
        req.docs = docs;
        return next();
    });

exports.sendJsonForSelectedData = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success',
            docs: req.docs
        })
    );

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.deleteOne(req.searchQuery);
        if (!docs.deletedCount) {
            return next(
                new AppError(
                    'Currently no datas available for this service',
                    400
                )
            );
        }
        return next();
    });
exports.sendJsonForDeleteOne = () =>
    catchAsync(async (req, res, next) =>
        res.status(200).json({
            status: 'Success'
        })
    );

// query with aggragate
exports.queryWithAggragate = () =>
    catchAsync(async (req, res, next) => {
        const apiClass = new ApiFeature(req.searchQuery, req.query)
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        const product = await apiClass.query;

        req.body.findAllFilter = product;
        return next();
    });
