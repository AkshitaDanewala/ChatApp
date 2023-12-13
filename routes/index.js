var express = require('express');
var router = express.Router();
const Users = require("../model/usermodel.js")

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index' );
});

router.post('/createAccount', async function(req, res, next) {
  try{
    const user = new Users(req.body)
    await user.save()
  res.redirect("/login" );
  }catch(err){
    res.send(err)
  }

});

router.get('/login', function(req, res, next) {
  res.render('login' );
});

router.post('/login', function(req, res, next) {
  res.render('login' );
});


router.get('/chatroom', function(req, res, next) {
  res.render('chatroom' );
});
module.exports = router;
