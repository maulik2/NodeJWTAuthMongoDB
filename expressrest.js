// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var routes = require('./routes/route');
var config = require('./config/config');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');


var mongoose   = require('mongoose');
mongoose.connect(config.database);

//var User     = require('./app/models/user');
//var UserAccount     = require('./app/models/userAccount');


app.set('view engine', 'ejs');


app.get('/login',function(req, res){
    res.render('pages/login')
})


app.get('/about',function(req, res){
    res.render('pages/about')
})


app.get('/signup',function(req, res){
    res.render('pages/signup')
})

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', routes);
//app.set('superSecret', config.secret);
app.use(morgan('dev'));

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
