const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log('Error loading .env:', result.error);
}

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD); // Printing it to verify it's loaded
console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0);
