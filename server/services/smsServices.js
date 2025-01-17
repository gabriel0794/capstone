const twilio = require('twilio');

// Your Twilio credentials (Replace these with your actual SID and Auth Token)
const accountSid = 'AC00892fed304e9f048ae609e5d31d5ac9';
const authToken = '008ae5475ac924a90f294baef834a09a';
const client = twilio(accountSid, authToken);

// Function to send an SMS
const sendSMS = (phoneNumber, message) => {
    client.messages
        .create({
            body: message,
            from: '+15076045642',  // Your Twilio phone number
            to: phoneNumber,
        })
        .then((message) => console.log('Message sent: ', message.sid))
        .catch((err) => console.error('Error sending message: ', err));
};

module.exports = sendSMS;  // Export the function to use in other files
