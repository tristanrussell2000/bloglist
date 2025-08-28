const bcrypt = require('bcrypt')
const User = require('../model/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const {describe, test, beforeEach, after} = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const assert = require('node:assert')

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await helper.resetUsersDb("dummyUser")
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ironclaw2000',
            password: 'thisisnotapassword',
            name: 'Tristan Russell'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'dummyUser',
            name: 'superuser',
            password: 'password'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('expected `username` to be unique'))
    })
})

after(async () => {
    await mongoose.connection.close()
})