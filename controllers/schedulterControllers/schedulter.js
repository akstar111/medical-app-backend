/* eslint-disable default-case */
// ============================================================
// import schedulers
const schedule = require('node-schedule');

const { runPillReminder } = require('./pillReminderSchedulter');

// ============================================================
// import models
const schedulerModel = require('../../models/shared/schedulersModel');

const schedulers = async () => {
    const schedules = await schedulerModel.aggregate([
        {
            $match: { status: { $ne: false } }
        },
        {
            $group: {
                _id: '$uniqueId',
                name: { $first: '$name' },
                type: { $first: '$type' },
                properties: { $first: '$properties' },
                status: { $first: '$status' },
                uniqueId: { $first: '$uniqueId' },
                reminderId: { $first: '$reminderId' },
                hiwasomID: { $first: '$hiwasomID' }
            }
        }
    ]);

    const scheduler = async (obj, reminderid, unic) => {
        schedule.scheduleJob(obj.hiwprrtEID, obj.time, () =>
            runPillReminder(obj, reminderid, unic)
        );
    };
    let len = 0;

    while (len < schedules.length) {
        switch (schedules[len].name) {
            case 'Pill Reminder':
                switch (schedules[len].type) {
                    case 'Remind Pills':
                        scheduler(
                            schedules[len].properties,
                            schedules[len].reminderId,
                            schedules[len].uniqueId
                        );
                }
                break;
        }
        len += 1;
    }
};

module.exports = schedulers;
