// ============================================================
// import models
const { validate } = require('uuid');

// ============================================================
// import controllers
const factoryControllers = require('../factoryControllers');

// ============================================================
// import models
const pillRemainderModel = require('../../models/PillReminder/pillRemainderModel');
const schedulterModel = require('../../models/shared/schedulersModel');
const memberModel = require('../../models/shared/membersModel');
const userModel = require('../../models/shared/userModel');

// ============================================================
// import utilities
const catchAsync = require('../../util/catchAsync');
const encryptID = require('../../util/uuid');
const AppError = require('../../util/AppError');
const sendEmail = require('../../util/sendMail');

const runPillReminder = catchAsync(async (remind, reminderId, unic) => {
    try {
        console.log('restarted');
        let memberdata = [];
        if (!remind.member) {
            console.log('restarted2');
            memberdata = memberModel.findOne({
                hiwmID: remind.memberEID,
                userId: remind.userId
            });
        }
        const checkedDta = await Promise.all([
            memberdata,
            userModel.findOne({
                phone: remind.intimationPerson.personPhone
            })
        ]);
        if (!remind.member) {
            remind.member = checkedDta[0];
        }
        const obj = {
            name: 'Pill Reminder',
            type: 'Remind Pills',
            status: true,
            properties: remind,
            hiwasomID: await encryptID(process.env.PILL_REMINDER_SECRET),
            uniqueId: unic,
            reminderId: reminderId,
            createdAt: Date.now()
        };

        await Promise.all([
            sendEmail({
                email: remind.userEmail,
                subject: 'Pill Reminder Neutral',
                message: `Your registerd persons's pill eating time. This will be one time reminder.`
            }),
            sendEmail({
                email: 'muthazhagan187@gmail.com',
                subject: 'Pill Reminder Patient',
                message: `Your pill take time is closen.Please eat the pill.here is the Details, \n
            name  : ${remind.medicineName}
            image : ${remind.pillImage}
            Number of pills : ${remind.noofPills}
            Befor food / After Food : ${remind.foodType} Food
            .`
            }),
            sendEmail({
                email: remind.userEmail,
                subject: 'Pill Reminder intimation person',
                message: `Your father pill eating time is about to come. so please make remind him.`
            })
        ]);

        return true;
    } catch (err) {
        console.log(err);
    }
});

module.exports = { runPillReminder };
