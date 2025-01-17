const twilio = require('twilio');

// Your Twilio credentials (Replace these with your actual SID and Auth Token)
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = twilio(accountSid, authToken);

// Function to send an SMS
const sendSMS = (phoneNumber, message) => {
    client.messages
        .create({
            body: message,
            from: 'your_phonenumber',  // Your Twilio phone number
            to: phoneNumber,
        })
        .then((message) => console.log('Message sent: ', message.sid))
        .catch((err) => console.error('Error sending message: ', err));
};

module.exports = sendSMS;  // Export the function to use in other files
