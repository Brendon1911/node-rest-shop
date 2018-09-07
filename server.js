const http = require('http');
const app = require('./app');

const port = process.env.$PORT || 8080;

const server = http.createServer(app);

server.listen(port, (req, res) => {
 console.log(`Server started on port ${port}`) ;
});