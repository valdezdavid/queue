const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication.js')(router);
const blogs = require('./routes/blogs')(router); // Import Blog Routes
const queues = require('./routes/queues')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) =>{
	if(err){
		console.log('Could NOT connect to database:', err );
	}
	else{
		console.log('Connected to db: ' + config.db);
	}
});

// Front end server, running on 8080 instead of 4200
// Provide static directory for frontend

var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors({
	origin: 'http://localhost:4200'
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.use('/authentication', authentication);
app.use('/blogs', blogs); // Use Blog routes in application
app.use('/queues', queues);

// Get is a type of req
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname + '/public/index.html'));
});



app.listen(port, ()=>{
	console.log('Listening on port' + port);
});