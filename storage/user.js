const fs = require('fs');
const path = __dirname + '/../database/users.json';

const userNotFound = new Error('user not found');

module.exports = {
    findOne: function (query, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8')).users;

        if (query._id) {
            users = users.filter(user => user._id == query._id)
        }
        if (query.username) {
            users = users.filter(user => user.username == query.username)
        }
        if (query.name) {
            users = users.filter(user => user.name == query.name)
        }
        if (query.email) {
            users = users.filter(user => user.email == query.email)
        }

        return users.length ? callbackFunc(null, users[0]) : callbackFunc(userNotFound, null)

    },

    find: function (query, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8')).users;

        if (query._id) {
            users = users.filter(user => user._id == query._id)
        }
        if (query.username) {
            users = users.filter(user => user.username == query.username)
        }
        if (query.name) {
            users = users.filter(user => user.name == query.name)
        }
        if (query.email) {
            users = users.filter(user => user.email == query.email)
        }

        return users.length ?
            callbackFunc(null, { users: users, count: users.length }) :
            callbackFunc(null, { users: [], count: 0 })
    },

    save: function (user, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8'));
        users.users.push({
            _id: users.lastInsertedId + 1,
            ...user
        })
        users.lastInsertedId += 1

        const data = JSON.stringify(users, null, 4)
        fs.writeFileSync(path, data)
        return callbackFunc(null)
    },

    update: function (query, newUser, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let i = 0; i < users.users.length; i++) {
            if (users.users[i]._id == query._id) {
                users.users[i] = newUser

                const data = JSON.stringify(users, null, 4)
                fs.writeFileSync(path, data)
                return callbackFunc(null)
            }
        }

        return callbackFunc(userNotFound)
    },

    remove: function (query, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let i = 0; i < users.users.length; i++) {
            if (users.users[i]._id == query._id) {
                // splice will return deleted item
                users.users.splice(i, 1)

                const data = JSON.stringify(users, null, 4)
                fs.writeFileSync(path, data)
                return callbackFunc(null)
            }
        }

        return callbackFunc(userNotFound)
    },

    findById: function (_id, callbackFunc) {
        let users = JSON.parse(fs.readFileSync(path, 'utf8'));

        for (let user of users.users) {
            if (user._id == _id) {
                callbackFunc(null, user)
                return
            }
        }

        callbackFunc(userNotFound, null)
    },
}