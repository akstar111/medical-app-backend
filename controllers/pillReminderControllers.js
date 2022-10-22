// ============================================================
// import models
const { validate } = require('uuid');
const schedule = require('node-schedule');
// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');
const {
    runPillReminder
} = require('./schedulterControllers/pillReminderSchedulter');

// ============================================================
// import models
const pillRemainderModel = require('../models/PillReminder/pillRemainderModel');
const memberModel = require('../models/shared/membersModel');
const schedulterModel = require('../models/shared/schedulersModel');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');
const membersModel = require('../models/shared/membersModel');

// assign data for create new reminder
exports.assingDataForGetAMember = catchAsync(async (req, res, next) => {
    req.searchQuery = { memberEID: req.body.memberEID, userId: req.user._id };
    req.body.createdAt = Date.now();
    req.body.userId = req.user._id;
    req.body.hiwprmEID = await encryptID(process.env.PILL_REMINDER_SECRET);
    return next();
});

// check valid time
exports.checkValidTimeForReminder = catchAsync(async (req, res, next) => {
    const regex = /^([0]\d|[1][0-2]):([0-5]\d)\s?(?:AM|PM)$/i;
    let data = await Promise.all(
        req.body.reminderTime.map(async (el) => {
            const ids =
                JSON.stringify(req.body.reminderTime).split(el.id).length > 2;

            if (ids) {
                return next(
                    new AppError(
                        'Please select the valid way to create pills.',
                        400
                    )
                );
            }

            if (regex.test(el.time)) {
                // console.log(req.body.reminderTime.length);
                if (el.id && validate(el.id)) {
                    const currentJob = schedule.scheduledJobs[el.id];
                    console.log(!!currentJob);
                    if (currentJob) {
                        currentJob.cancel();
                    }
                    return {
                        time: el.time,
                        noofPills: el.noofPills,
                        hiwprrtEID: el.id
                    };
                }
                const uuid = await encryptID(process.env.PILL_REMINDER_SECRET);
                return {
                    time: el.time,
                    noofPills: el.noofPills,
                    hiwprrtEID: uuid
                };
            }
        })
    );
    data = data.filter(Boolean);

    if (!data.length) {
        return next(
            new AppError('Please select the valid way to create pills.', 400)
        );
    }

    req.body.reminderTime = data;
    return next();
});

// createa new reminder
exports.findAMember = factoryControllers.findOne(memberModel);

// create a pill reminder
exports.createNewPillReminder =
    factoryControllers.createOne(pillRemainderModel);

// send json for create one
exports.sendJsonServices = factoryControllers.sendJson();

// assign data for update pill reminder
exports.assinDataforGetupdatepillReminder = (req, res, next) => {
    req.updateOneSearch = {
        hiwprmEID: req.params.reminderId,
        userId: req.user._id
    };
    return next();
};

// update one
exports.updatepillReminder = factoryControllers.updateOne(pillRemainderModel);

// send jsong for updateone
exports.sendJsonForupdateone = factoryControllers.sendJsonForUpdateOne();

// // set cron
exports.cronJob = catchAsync(async (req, res, next) => {
    const arr = [0, '*', '*', '*', '*', '*'];

    if (req.body.scheduleDate.scheduleType === 'selectedDay') {
        const startDate = new Date(req.body.scheduleDate.startDate);
        const endDate = new Date(req.body.scheduleDate.endDate);
        if (endDate.getFullYear() - startDate.getFullYear() > 1) {
            return next(
                new AppError('A Date should not be more then a year.', 400)
            );
        }
        if (
            startDate.getDate() >= endDate.getDate() &&
            startDate.getMonth() < endDate.getMonth()
        ) {
            arr[3] = `${startDate.getDate()}-31,1-${endDate.getDate()} `;
        } else if (startDate.getDate() < endDate.getDate()) {
            arr[3] = `${startDate.getDate()}-${endDate.getDate()} `;
        } else {
            arr[3] = startDate.getDate();
        }
        if (startDate.getMonth() === 11) {
            arr[4] = `12-1`;
        } else if (startDate.getMonth() === endDate.getMonth()) {
            arr[4] = `${startDate.getMonth() + 1}`;
        } else {
            arr[4] = `${startDate.getMonth() + 1}-${startDate.getMonth() + 2} `;
        }
    } else if (req.body.scheduleDate.scheduleType === 'selectedDay') {
        eq.body.scheduleDate.startDate = undefined;
        eq.body.scheduleDate.endDate = undefined;
    }
    await Promise.all(
        req.body.reminderTime.map(async (el) => {
            const checkword = el.time.split(' ').join('').split('').length;
            if (checkword !== 7) {
                return next(
                    new AppError(
                        'Somehting went wrong while processing your request',
                        400
                    )
                );
            }
            const checkpm = !!el.time.match(/pm$/i);
            const checkam = !!el.time.match(/am$/i);
            let time = el.time.slice(0, 5);
            if (checkpm) {
                time = time.split(':');
                arr[2] = time[0] * 1 !== 12 * 1 ? time[0] * 1 + 12 : 12;
                arr[1] = time[1];
            } else if (checkam) {
                time = time.split(':');
                arr[2] = time[0] * 1 !== 12 ? time[0] : '00';
                arr[1] = time[1];
            }
            const pillTime = arr.join(' ');
            const obj = {
                member: req.docs ?? false,
                time: pillTime,
                memberEID: req.body.memberEID,
                medicineName: req.body.medicineName,
                description: req.body.description,
                pillImage: req.body.pillImage,
                foodType: req.body.foodType,
                intimationPerson: req.body.intimationPerson,
                sms: req.body.sms,
                userId: req.user._id,
                userEmail: req.user.email,
                noofPills: el.noofPills,
                hiwprrtEID: el.hiwprrtEID
            };
            const nObj = {
                name: 'Pill Reminder',
                type: 'Remind Pills',
                status: true,
                properties: obj,
                hiwasomID: await encryptID(process.env.PILL_REMINDER_SECRET),
                uniqueId: el.hiwprrtEID,
                reminderId: req.body.hiwprmEID ?? req.params.reminderId,
                createdAt: Date.now()
            };
            console.log('1');
            await schedulterModel.create(nObj);
            console.log(pillTime);
            return schedule.scheduleJob(el.hiwprrtEID, pillTime, async () =>
                runPillReminder(
                    obj,
                    req.body.hiwprmEID ?? req.params.reminderId,
                    el.hiwprrtEID
                )
            );
        })
    );

    return res.status(200).json({
        status: 'Success'
    });
});

// delete all previous reminders
exports.deleteAllPreviousReminders = catchAsync(async (req, res, next) => {
    await schedulterModel.updateMany(
        {
            reminderId: req.params.reminderId,
            status: { $ne: false }
        },
        {
            status: false
        }
    );
    req.body.UOdocs = undefined;

    return next();
});

// get all my pill reminders
exports.getMyPillReminders = catchAsync(async (req, res, next) => {
    let [reminders, members] = await Promise.all([
        pillRemainderModel.aggregate([
            { $match: { userId: req.user._id, status: true } },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberEID',
                    foreignField: 'hiwmID',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                hiwmID: 1
                            }
                        }
                    ],
                    as: 'member'
                }
            },
            {
                $unwind: '$member'
            }
        ]),
        membersModel.find({ userId: req.user._id })
    ]);

    return res
        .status(200)
        .json({ status: 'Success', docs: reminders, members });
});
