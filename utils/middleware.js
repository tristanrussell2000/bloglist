const logger = require('./logger')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique'})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        request.token = auth.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (request, response, next) => {
    if (request.token) {
        const token = jwt.verify(request.token, process.env.SECRET)
        if (token && token.id) {
            const user = await User.findById(token.id)
            request.user = user
        } else {
            return response.status(404).json({error: "invalid token"})
        }
    }
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}