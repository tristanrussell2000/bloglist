const blogsRouter = require('express').Router()
const Blog = require('../model/blog')
const User = require('../model/user')
const Comment = require('../model/comment')

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user').populate('comments')
        response.json(blogs)
    } catch (error) {
        next(error)
    }
})

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id).populate('user').populate('comments')
        if (blog) {
            return response.json(blog)
        } else {
            return response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

blogsRouter.post('/:id/comment', async (request, response, next) => {
    let comment = new Comment(request.body)
    const commentSavePromise = comment.save()
    const blogFindPromise = Blog.findById(request.params.id)
    const [savedComment, blog] = await Promise.all([commentSavePromise, blogFindPromise])
    blog.comments = [...blog.comments, comment.id]
    await blog.save()
    response.status(201).json(savedComment)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    if (!request.user) return response.status(401).json({error: 'auth token required'})

    const user = request.user
    if (!user) {
        return response.status(400).json({error: 'userId missing or not valid'})
    }
    blog.user = user._id

    if (!blog.likes) blog.likes = 0

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    if (!request.user) return response.status(401).json({error: 'auth token required'})
    user = request.user
    const blog = await Blog.findById(request.params.id)
    if (blog.user?.toString() !== user._id.toString()) return response.status(401).json({error: "User cannot delete blogs it didn't create"})
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response, next) => {
    try {
        await delay(2000)
        const blogUpdate = request.body
        const blog = await Blog.findById(request.params.id)
        Object.assign(blog, blogUpdate)
        const result = await (await blog.save()).populate('user')
        response.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

module.exports = blogsRouter