// Starting point of application
// Just used to initialize server - routes are elsewhere
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router.js');
const mongoose = require('mongoose');
const cors = require('cors');

// DB Setup
// tell mongoose to connect to this particular instance
// of mongodb - this creates a db called 'auth'
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup
// morgan is logging framework middleware for incoming requests
app.use(morgan('combined'));
// cors is middleware that allows our server to respond to requests from any domain
app.use(cors());
// body-parser is middleware used to parse incoming requests into JSON
app.use(bodyParser.json({type: '*/*'}));
// app is passed into router, which has been imported from router.js
router(app);

// Server Setup
const port = process.env.PORT || 3090;
// Create a server capable of receiving http requests,
// and any time they come in, forward them to app
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);