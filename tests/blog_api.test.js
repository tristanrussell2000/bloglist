const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../model/blog')
const api = supertest(app)
const helper = require('./test_helper')

describe('when there is initially some blogs saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await helper.resetUsersDb("blogUser")
    })
    
    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('id field is id, not _id', async () => {
        const blogs = await helper.blogsInDb()
        const allUseIdField = blogs.every(blog => {
            return blog._id === undefined && blog.id
        })
        assert(allUseIdField)
    })
    
    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
    
        const titles = response.body.map(e => e.title)
        assert.strictEqual(titles.includes(helper.initialBlogs[0].title), true)
    })

    describe('viewing a specific blog', () => {
        test('a specific blog can be viewed', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]
        
            const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
            assert.deepStrictEqual(resultBlog.body, blogToView)
        })

        test('fails with status 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()
    
            await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
        })
    })
    
    describe('addition of a new blog', () => {
        test('a valid blog can be added', async () => {
            const {user, token} = await helper.getValidUserAndToken()
            const newBlog = {
                title: "Add Test Blog",
                author: "The Machine",
                likes: 1000,
                userId: user._id
            }
        
            await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
            
            const titles = blogsAtEnd.map(b => b.title)
            assert(titles.includes('Add Test Blog'))
        })

        test('blog without title isn\'t added', async () => {
            const {user, token} = await helper.getValidUserAndToken()
            const newBlog = {
                author: "Not an Author",
                likes: 100
            }
        
            await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
        
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('missing likes field in post defaults to 0', async () => {
            const {user, token} = await helper.getValidUserAndToken()
            const newBlog = {
                title: "dummyTest",
                author: "dummy",
                userId: user._id
            }
        
            const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
        
            assert.strictEqual(result.body.likes, 0)
        })
    })

    describe('deletion of a blog', () => {
        test('a blog can be deleted', async () => {
            const {user, token} = await helper.getValidUserAndToken()
            const blogToDelete = new Blog({
                title: "Delete Me",
                author: "I NEED TO BE DELETED",
                user: user._id
            })
            await blogToDelete.save()
        
            await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        
            const blogsAtEnd = await helper.blogsInDb()
            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))
        
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('updating a blog', () => {
        test('update blog name with valid string', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogIdToUpdate = blogsAtStart[0].id
            const patchData = {
                title: "New Title"
            }
            const result = await api
            .patch(`/api/blogs/${blogIdToUpdate}`)
            .send(patchData)
            .expect(200)

            assert(result.body.title, "New Title")
        })

        test('update a blog name with null', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogIdToUpdate = blogsAtStart[0].id
            const patchData = {
                title: null
            }
            await api
            .patch(`/api/blogs/${blogIdToUpdate}`)
            .send(patchData)
            .expect(400)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})

