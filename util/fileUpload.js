// ============================================================
// import packages
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');

// ============================================================
// import utlities
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

const multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
    try {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(
                new AppError('Not a image type please upload the image', 400),
                false
            );
        }
    } catch (err) {
        console.log('av' + err);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
// singleImage
exports.uploadSingleImage = (name) => upload.single(name);

// upload multiple images
exports.uploadMultipleImages = (name, maxCount) =>
    upload.fields([{ name, maxCount }]);

// resize userphoto
exports.resizeSingleImage = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create') {
        if (!req.file)
            return next(new AppError('Image should be included.', 400));
    }
    if (!req.file) return next();

    const data = sharp(req.file.buffer)
        .resize(req.image.resizeW * 1, req.image.resizeH * 1)
        .toFormat('jpeg')
        .jpeg({ quality: 90 });
    req.image.data = data;
    next();
});

// resize multiple iamges
exports.resizeMultipleImages = catchAsync(async (req, res, next) => {
    req.image.imageGallery = [];

    await Promise.all(
        req.files[req.image.multiImageName].map(async (el, i) => {
            const data = sharp(el.buffer)
                .resize(req.image.resizeW, req.image.resizeH)
                .toFormat('jpeg')
                .jpeg({ quality: 90 });

            req.image.imageGallery.push(data);
        })
    );

    next();
});

// upload multiple images
exports.uploadMultipleImageOnAWS = catchAsync(async (req, res, next) => {
    req.body[req.image.gallery] = [];
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    await Promise.all(
        req.image.imageGallery.map(async (el, i) => {
            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${req.image.galleryImagename}-${i + 1}.jpeg`,
                ContentType: 'image/jpeg',
                Body: el
            };
            try {
                const a = await s3.upload(params).promise();
                return req.body[req.image.gallery].push(a.Location);
            } catch (err) {
                console.log(err);
                return next(
                    new AppError(
                        'Somehing went wrong while processing your request.Ptry again.',
                        401
                    )
                );
            }
        })
    );
    console.log(req.body);
    return next();
});

// upload files in s3
exports.uploadFilesinAWS = catchAsync(async (req, res, next) => {
    if (!req.image.data) {
        return next();
    }
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${req.image.imagename}.jpeg`,
        ContentType: 'image/jpeg',
        Body: req.image.data
    };
    s3.upload(params, (err, data) => {
        if (err) {
            return next(
                new AppError(
                    'Somehing went wrong while processing your request.Please try again.',
                    401
                )
            );
        }
        req.body[req.image.name] = data.Location;

        return next();
    });
});

// single image and multiple images
exports.uploadSinglAndMultipleImage = upload.fields([
    {
        name: 'image',
        maxCount: 1
    },
    {
        name: 'imageGallery',
        maxCount: 6
    }
]);

exports.resizeImageAndGallerys = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create') {
        if (!req.files.image.length || !req.files.imageGallery.length)
            return next(
                new AppError(
                    'Banner image and service image should be included.',
                    400
                )
            );
    }
    // image cover
    if (req.files.image)
        req.image.image = sharp(req.files.image[0].buffer)
            .resize(req.image.resizeW, req.image.resizeH)
            .toFormat('jpeg')
            .jpeg({ quality: 90 });

    // images
    if (req.files?.imageGallery?.length) {
        req.image.imageGallery = [];
        await Promise.all(
            req.files.imageGallery.map(async (el, i) => {
                const data = sharp(el.buffer)
                    .resize(req.image.resizeW, req.image.resizeH)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 });

                req.image.imageGallery.push(data);
            })
        );
    }
    return next();
});

// upload files in aws
exports.uploadFilesinAWSVariable = catchAsync(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    if (req.image.image) {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${req.image.imagename}.jpeg`,
            ContentType: 'image/jpeg',
            Body: req.image.image
        };
        try {
            console.log(req.image.name);
            const bannerImage = await s3.upload(params).promise();
            req.body[req.image.name] = bannerImage.Location;
        } catch (err) {
            return next(
                new AppError(
                    'Somehing went wrong while processing your request.Please try again.',
                    401
                )
            );
        }
    }
    if (req.image.imageGallery?.length) {
        req.body[req.image.gallery] = [];
        await Promise.all(
            req.image.imageGallery.map(async (el, i) => {
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${req.image.galleryName}-${i + 1}.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el
                };
                try {
                    const a = await s3.upload(params).promise();
                    return req.body[req.image.gallery].push(a.Location);
                } catch (err) {
                    return next(
                        new AppError(
                            'Somehing went wrong while processing your request.Please try again.',
                            401
                        )
                    );
                }
            })
        );
    }
    return next();
});
