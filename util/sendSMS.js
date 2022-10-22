const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = async (options) => {
    await client.messages.create({
        body: options.message,
        messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_ID,
        to: options.phone
    });
};
// const Vonage = require('@vonage/server-sdk');

// const vonage = new Vonage({
//     apiKey: 'e661cc90',
//     apiSecret: 'clK8Sdo7aO5nQ8AG'
// });
// const sendSMS = async (options) => {
//     const from = 'Vonage APIs';
//     const to = '918248335181';
//     const text = options.message;

//     vonage.message.sendSms(from, to, text, (err, responseData) => {
//         if (err) {
//             console.log(err);
//         } else if (responseData.messages[0].status === '0') {
//             console.log('Message sent successfully.');
//         } else {
//             console.log(
//                 `Message failed with error: ${responseData.messages[0]['error-text']}`
//             );
//         }
//     });
// };
module.exports = sendSMS;
