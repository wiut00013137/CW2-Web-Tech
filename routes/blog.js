const express = require('express');
const router = express.Router();

// Blog model
const Blog = require('../storage/blog');

// new blog form
router.get('/add', function (req, res) {
  res.render('add_blog', {
    title: 'Add Blog'
  });
});

// submit new blog 
router.post('/add', function (req, res) {
  // Express validator
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get errors
  let errors = req.validationErrors();

  if (errors) {
    res.render('add_blog', {
      title: 'Add Blog',
      errors: errors
    });
  } else {
    let blog = {};
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.body = req.body.body;

    Blog.save(blog, function (err) {
      if (err) {
        console.error(err);
        return;
      } else {
        req.flash('success', 'Blog Added');
        res.redirect('/');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    res.render('edit_blog', {
      title: 'Edit Blog',
      blog: blog
    });
  });
});

// update submit new blog 
router.post('/edit/:id', function (req, res) {
  let blog = {};
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.body = req.body.body;

  let query = { _id: req.params.id };

  Blog.update(query, blog, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Blog Updated');
      res.redirect('/');
    }
  })
});

// Delete post
router.delete('/:id', function (req, res) {
  let query = { _id: req.params.id };

  Blog.remove(query, function (err) {
    if (err) {
      console.error(err);
      return;
    } else {
      req.flash('success', 'Blog Deleted')
      res.send('Success');
    }
  });
});

// get single blog
router.get('/:id', function (req, res) {
  Blog.findById(req.params.id, function (err, blog) {
    res.render('blog', {
      blog: blog
    });
  });
});

module.exports = router;