var express    = require('express'); 
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var router = express.Router();              // get an instance of the express Router



var User     = require('./models/user');
var UserAccount = require('./models/userAccount');


// // middleware to use for all requests
// router.use(function(req, res, next) {
//     // do logging
//     console.log('Something is happening.');
//     next(); // make sure we go to the next routes and don't stop here
// });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.use('/api', router);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
// more routes for our API will happen here


router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var user = new User();      // create a new instance of the Bear model
        user.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    })


     .get(function(req, res) {
        User.find(function(err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });
    });



// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/users/:user_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
          
          var user = new User(); 

        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    .put(function(req, res) {

        // use our bear model to find the bear we want
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the bears info

            // save the bear
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    })

    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



router.route('/userAccount')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var userAccount = new UserAccount();  
            
        userAccount.firstname = req.body.firstname,
        userAccount.lastname = req.body.lastname,
         userAccount.addressline1 = req.body.addressline1,
    userAccount.addressline2= req.body.addressline2,
    userAccount.city= req.body.city,
    userAccount.state= req.body.state,
    userAccount.zipcode= req.body.zipcode,
    userAccount.country= req.body.country,
    userAccount.personalemail= req.body.personalemail,
    userAccount.businessemail= req.body.businessemail,
    userAccount.homephone= req.body.homephone,
    userAccount.cellphone= req.body.cellphone;  // set the bears name (comes from the request)

        // save the bear and check for errors
        userAccount.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User Account created!' });
        });
        
    })


     .get(function(req, res) { 

        UserAccount.find(function(err, userAccount) {
            if (err)
                res.send(err);

            res.json(userAccount);
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


module.exports = router;