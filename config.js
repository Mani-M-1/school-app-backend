const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost',
    PORT : process.env.PORT || 3000,
    MONGOOSE_URI: process.env.MONGOOSE_URI
}


// const dotenv = require('dotenv');
// const path = require('path');
// const fs = require('fs');

// dotenv.config({
//     path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
// });


// // Determine the environment (e.g., based on an environment variable)
// const environment = process.env.NODE_ENV || 'development';

// // Determine the command based on the environment
// let command;
// if (environment === 'production') {
//   command = 'npm run prod';
// } else {
//   command = 'npm run dev';
// }

// // Generate the Procfile content
// const procfileContent = `web: ${command}`;

// // Write the Procfile content to a file
// fs.writeFile('Procfile', procfileContent, (err) => {
//   if (err) {
//     console.error('Error writing to Procfile:', err);
//   } else {
//     console.log('Procfile updated successfully.');
//   }
// });


// module.exports = {
//     NODE_ENV : process.env.NODE_ENV || 'development',
//     HOST: process.env.HOST || 'localhost',
//     PORT : process.env.PORT || 3000,
//     MONGOOSE_URI: process.env.MONGOOSE_URI
// }