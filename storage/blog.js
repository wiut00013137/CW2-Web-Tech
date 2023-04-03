const fs = require('fs');
const path = __dirname + '/../database/blogs.json';

const blogNotFound = new Error('blog not found');

module.exports = {
    findOne: function (query, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8')).blogs;

        if (query._id) {
            blogs = blogs.filter(blog => blog._id == query._id)
        }
        if (query.title) {
            blogs = blogs.filter(blog => blog.title == query.title)
        }
        if (query.author) {
            blogs = blogs.filter(blog => blog.author == query.author)
        }

        return blogs.length ? callbackFunc(null, blogs[0]) : callbackFunc(blogNotFound, null)

    },

    find: function (query, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8')).blogs;

        if (query._id) {
            blogs = blogs.filter(blog => blog._id == query._id)
        }
        if (query.title) {
            blogs = blogs.filter(blog => blog.title == query.title)
        }
        if (query.author) {
            blogs = blogs.filter(blog => blog.author == query.author)
        }

        return blogs.length ?
            callbackFunc(null, { blogs: blogs, count: blogs.length }) :
            callbackFunc(null, { blogs: [], count: 0 })
    },

    save: function (blog, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8'));
        blogs.blogs.push({
            _id: blogs.lastInsertedId + 1,
            ...blog
        })
        blogs.lastInsertedId += 1

        const data = JSON.stringify(blogs, null, 4)
        fs.writeFileSync(path, data)
        return callbackFunc(null)
    },

    update: function (query, newBlog, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let i = 0; i < blogs.blogs.length; i++) {
            if (blogs.blogs[i]._id == query._id) {
                blogs.blogs[i] = {
                    "_id":  blogs.blogs[i]._id,
                    ...newBlog
                }

                const data = JSON.stringify(blogs, null, 4)
                fs.writeFileSync(path, data)
                return callbackFunc(null)
            }
        }

        return callbackFunc(blogNotFound)
    },

    remove: function (query, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let i = 0; i < blogs.blogs.length; i++) {
            if (blogs.blogs[i]._id == query._id) {
                // splice will return deleted item
                blogs.blogs.splice(i, 1)

                const data = JSON.stringify(blogs, null, 4)
                fs.writeFileSync(path, data)
                return callbackFunc(null)
            }
        }

        return callbackFunc(blogNotFound)
    },

    findById: function (_id, callbackFunc) {
        let blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let blog of blogs.blogs) {
            if (blog._id == _id) {
                callbackFunc(null, blog)
                return
            }
        }

        callbackFunc(blogNotFound, null)
    },
}