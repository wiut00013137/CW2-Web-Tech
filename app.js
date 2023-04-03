const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const Blog = require('./storage/blog');

// Route Files
const blogs = require('./routes/blog');
const users = require('./routes/users');


// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.get('/', function (req, res) {
  Blog.find({}, function(err, blogs){
    if(err){
      console.error(err);
    } else {
      res.render('index', {
        title: 'Articles', 
        blogs: blogs.blogs
      });
    }
  });
});


// Any routes that goes to '/blogs' will go to the 'blogs.js' file in route
app.use('/blogs', blogs);
app.use('/users', users);

app.listen(3000, function(){
  console.log(`Server started on port 3000`);
})
