var express    = require('express'); 
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var router = express.Router();              // get an instance of the express Router



var User     = require('../models/user');
var UserAccount = require('../models/userAccount');
var Friendship = require('../models/friendship');

app.set('superSecret', config.secret);


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


// more routes for our API will happen here

//member sign up requests and log user in after sign up
router.route('/signup')


    .post(function(req, res) {     
        
        if ( !req.body.name || !req.body.password){
            res.json({success:false, msg:'Please enter username and password'});
        } else 
        {
         var newuser = new User();      
        newuser.name = req.body.name; 
        newuser.password = req.body.password; 
         newuser.email = req.body.email;
        // save the bear and check for errors
        User.findOne({
            name: new RegExp( req.body.name, "i")
        }, function(err, user) {
            if (err){
                    throw err;
            }
            else if (!user){    

        newuser.save(function(err) {
            if (err){
                res.send(err);               
            }
            else {
                   
             User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err;

            else if (user) {
               // if(user.password != req.body.password){
                   user.comparePassword(req.body.password,function(err, data ){
                      if (err){
                            throw err;
                      } else 
                      //if (data)
                           {
                    var user_id = user._id
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn:"90d"
                    });
                    res.render('./pages/login.ejs')                   
                } 
                
            
        });
            }
        });


            }
        });  //end of save 
        } else
            {
                 return res.json({success:false, msg:'Username already exists.'});
            } 

 });
        
        }        
    });

//member login by authenticate 

router.route('/authenticate')

    .post(function(req,res){

        User.findOne({
            name: req.body.name
        }, function(err, user){
            if (err) throw err;

            if(!user){
                res.json({success: false, message:'Authentication failed. User not found'});
            } else if (user) {
               // if(user.password != req.body.password){
                   user.comparePassword(req.body.password,function(err, data ){
                      if (err){
                            throw err;
                      } else if (data)
                           {
                    var user_id = user._id
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn:"90d"
                    });

                 res.json({
                        success:true,
                        message:'Login Successfull. Enjoy the JWT Token below to access secure api',
                        id:user_id,
                        token:token
                       }) ; 

                    
                                    
                } else 
                {
                    res.json({success: false, message:'Authentication failed. Wrong password'});
                }
            
        });
            }
        });
   });

// this makes sure all api under this route is squre and require token to access -- the order of this route is important it has to be on top of all secure api methods

router.use(function(req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){

        jwt.verify(token, app.get('superSecret'), function(err,decoded){
            if (err){
                return res.json({success:false, message:'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {

        return res.status(403).send({
            success: false,
            message:'No token provided.'
        });
    }
});


//logout user by destroying token for mobile app
router.route('/logout')

    .get(function(req, res) { 

            if (err)
                res.send(err);

            res.json({
                success:true,
                        message:'Logout',
                        id:null,
                        token:null}
            );
        });
  


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

    // create a user account
    .post(function(req, res) {
        
        var userAccount = new UserAccount();  
          userAccount.userid = req.body.userid, 
          userAccount.userlogon =  req.body.userid, 
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

        // save the user account detail and check for errors
        userAccount.save(function(err) {
            if (err)
                res.send(err);

        //           var user = new User(); 

        //  User.findById(req.params.user_id)
        //         .populate('account') 
        //         .exec(function(err, user){
        //             res.json(user.account);
        //         })

       

        UserAccount.findOne( 
            {userid : req.body.userid},
        function(err, userAccount){
            if (err) throw err;


             var userFriendship = new Friendship();
        userFriendship.owner_useraccountid = userAccount._id,
        userFriendship.twoway = false;


        userFriendship.save(function(err){
             if (err) throw err;

        })

            var accountid = userAccount._id;

            User.findById(req.body.userid, function (err, user){
                if (err) throw err;

                user.account = accountid;

                user.save(function(err){
                    if (err) throw err;

                     res.json({ message: 'User Account created!' });
                })
                
            })

        })
        });
        
    })


     .get(function(req, res) { 

        UserAccount.find(function(err, userAccount) {
            if (err)
                res.send(err);

            res.json(userAccount);
        });
    });



router.route('/getaccount/:user_id')

    .get(function(req, res){

        var user = new User(); 

         User.findById(req.params.user_id)
                .populate('account') 
                .exec(function(err, user){
                    res.json(user.account);
                })

        });



 router.route('/friendrequesttest')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    
    .post(function(req, res) {
        
      Friendship.findOneAndUpdate(
          {owner_useraccountid: req.body.owner_useraccountid},
          {$push: {useraccountid: req.body.useraccountid}},
          {safe:true, upsert:true},
          function(err, userAccount){
              if (err) throw err;

              res.json(userAccount);
          }
      )
        
    })

     .get(function(req, res){
         
           var userFriendship = new Friendship();

         Friendship.findOne ({owner_useraccountid: req.headers.owner_useraccountid } ,
         function(err, userFriendship){
             if (err) throw err;

                 Friendship.findById(userFriendship._id)
                .populate('useraccountid') 
                .exec(function(err, userFriendship){
                    res.json(userFriendship.useraccountid);
                })
            
         } )

        });



router.route('/friendrequest')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
     .post(function(req, res) {
        
      Friendship.findOneAndUpdate(
          {owner_useraccountid: req.body.owner_useraccountid},
          {$push: {pendinguseraccountid: req.body.useraccountid}},
          {safe:true, upsert:true},
          function(err, userAccount){
              if (err) throw err;

              res.json(userAccount);
          }
      )
        
    });



    router.route('/friendaccept')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
 .post(function(req, res) {
        
      Friendship.findOneAndUpdate(
          {owner_useraccountid: req.body.owner_useraccountid},
          {$push: {useraccountid: req.body.useraccountid}},
          {safe:true, upsert:true},
          function(err, userAccount){
              if (err) throw err;

              res.json(userAccount);
              //send the user account as response but also execute this
             //this method is used to make another entry on accepeters id s friednd list of the original owner of the firend request
            Friendship.findOneAndUpdate(
          {owner_useraccountid: req.body.useraccountid},
          {$push: {useraccountid: req.body.owner_useraccountid}},
          {safe:true, upsert:true},
          function(err, userAccount){
              if (err) throw err;

             // res.json(userAccount);
             //once both friendship is added remove pending request
        Friendship.findOneAndUpdate(
          {owner_useraccountid: req.body.owner_useraccountid},
          {$pop: {pendinguseraccountid: req.body.useraccountid}},
          {safe:true, upsert:true},
          function(err, userAccount){
              if (err) throw err;

            //  res.json(userAccount);
        })

          })
          }
      )   
 });




router.route('/friendlist')

    .get(function(req, res){
         
           var userFriendship = new Friendship();

         Friendship.findOne ({owner_useraccountid: req.headers.owner_useraccountid } ,
         function(err, userFriendship){
             if (err) throw err;

                 Friendship.findById(userFriendship._id)
                .populate('useraccountid') 
                .exec(function(err, userFriendship){
                    res.json(userFriendship.useraccountid);
                })
            
         } )

        });

router.route('/pendingfriendlist')

    .get(function(req, res){
         
           var userFriendship = new Friendship();

         Friendship.findOne ({owner_useraccountid: req.headers.owner_useraccountid } ,
         function(err, userFriendship){
             if (err) throw err;

                 Friendship.findById(userFriendship._id)
                .populate('pendinguseraccountid') 
                .exec(function(err, userFriendship){
                    res.json(userFriendship.pendinguseraccountid);
                })
            
         } )

        });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);




module.exports = router;