var express = require('express');
var router = express.Router();
const Users = require("../model/usermodel.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(Users.authenticate()));
const nodemailer = require("nodemailer")
const email = require("../authenticationhide.js")

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

router.post('/forgotpassword', async function(req, res, next) {
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
      user: email.gmail,
      pass: email.pass,
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
   res.render("captcha", {admin: req.user, email: user.email})
  });
}


router.post('/captchamail/:email',  isloggedIn, async function(req, res, next) {

  try{
    const user = await Users.findOne({email: req.params.email})  
    if(user.forgotpassword == req.body.captcha){
      user.forgotpassword = -1
      await user.save()
  res.render('resetpassword', {admin: req.user, id: user._id, email: user.email} );
    }else{
      res.send("Invalid Captcha, Try Again <a href='/forget'>Forget Password</a>")
    }
  }catch(err){
    res.send(err)
  }
});



router.post('/resetpassword/:id',  isloggedIn, async function(req, res, next) {
  try{
    const user = await Users.findById(req.params.id)
    await user.setPassword(req.body.password)
    await user.save()
    res.redirect("/login")
  }catch(err){
    res.send(err)
  }
});




router.get('/chatroom',  isloggedIn, async function(req, res, next) {

  try{
    const user = await Users.find()
    res.render('chatroom', {admin: req.user, data: user} );
  }catch(err){
    res.send(err)
  }
});






module.exports = router;
