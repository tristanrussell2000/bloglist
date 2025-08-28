const Blog = require('../model/blog')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
        title: "This is a dummy blog, part 1",
        author: "Tristan",
        likes: 1
    },
    {
        title: "This is a totally real blog",
        author: "Tristan",
        likes: 3000
    },
    {
        title: "This is someone elses blog",
        author: "Mill",
        likes: 50
    }
]

const nonExistingId = async () => {
    const blog = new Blog({title: "Dummy", author:"Dummy", likes: 0})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const resetUsersDb = async (newUserName) => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'dummyUser', passwordHash: passwordHash})

    await user.save()

    return
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const getValidUserAndToken = async () => {
    const users = await User.find({})
    const user = users[0]
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60 * 60}
    )
    return {user, token}
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb, resetUsersDb, getValidUserAndToken
}