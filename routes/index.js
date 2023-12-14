var express = require('express');
var router = express.Router();
const Users = require("../model/usermodel.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(Users.authenticate()));
const nodemailer = require("nodemailer")

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {admin: req.user} );
});

router.post('/createAccount', async function(req, res, next) {

  try{
      await Users.register({username: req.body.username, email: req.body.email, number: req.body.number}, req.body.password)
      res.redirect("/login")
  }catch(err){
    console.log(err)
    res.send(err)
  }

});

router.get('/login', function(req, res, next) {
  res.render('login' , {admin: req.user});
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/chatroom",
  failureRedirect: "/login"
}),
 function(req, res, next) {}
 );


 function isloggedIn(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.redirect("/login")
  }
 }

 router.get('/forgot',  isloggedIn, function(req, res, next) {
  res.render('forgot', {admin: req.user} );
});

router.post('/forgotpasswordt', async function(req, res, next) {
try{
  const user = await Users.findOne({email: req.body.email})
  if(!user) return res.send("user not found")

  sendmail(req, res, user)
}catch(err){
  res.send(err)
}

});

function sendmail(req, res, user){

  const captcha = Math.random().toString(36).substring(2, 8)

  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "akshitadanewala@gmail.com",
      pass: "gkev mbhx qjfq zpxf",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
  },
  });

  // receiver mailing info
  const mailOptions = {
    from: "Akshita Pvt. Ltd.<akshitadanewala@gmail.com>",
    to: user.email,
    subject: "Testing Mail Service",
    text: req.body.message,
    html: `<h3>This is Your Captcha: ${captcha}</h3>`,
  };

  // actual object which intregrate all info and send mail
  transport.sendMail(mailOptions, (err, info) => {
    if (err) return res.send(err);
    console.log(info);
    user.forgotpassword = captcha
    user.save()
   res.render("otp", {admin: req.user, email: user.email})
  });
}


router.get('/captcha',  isloggedIn, function(req, res, next) {
  res.render('captcha', {admin: req.user} );
});

router.get('/chatroom',  isloggedIn, function(req, res, next) {
  res.render('chatroom', {admin: req.user} );
});
module.exports = router;
