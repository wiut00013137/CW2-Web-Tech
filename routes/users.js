const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../storage/user');

// Register form
router.get('/register', function(req, res){
  res.render('register');
});

// Register process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors
    });
  } else {
    let newUser = {
      name: name,
      email: email,
      username: username,
      password: password
    };
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.error(err);
        }
        newUser.password = hash;

        User.save(newUser, function(err){
          if(err) {
            console.error(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    })
  }
});

// Login form
router.get('/login', function(req, res) {
  res.render('login');
});

// Login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout form
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;