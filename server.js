const http = require ('http');
const app = require('./app'); 


const config =  require('./config.js');



// const port = process.env.PORT || 3000;



console.log(`NODE_ENV=${config.NODE_ENV}`);
console.log(`${config.HOST}`);
console.log(`${config.MONGOOSE_URI}`);




const server = http.createServer(app);

server.listen(config.PORT, () => console.log(`Listening to port ${config.PORT}`));
