const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((fav, curr) => {
        return curr.likes > (fav?.likes ?? 0) ? curr : fav
    }, null)
}

const mostBlogs = (blogs) => {
    const authors = {}
    for (blog of blogs) {
        const author = blog.author
        if (!authors[author]) {
            authors[author] = 1
        } else {
            authors[author] += 1
        }
    }
    const mostBlogger = Object.keys(authors).reduce((best, curr) => {
        return authors[curr] > (best ? authors[best] : -Infinity) ? curr : best
    }, "")
    return { author: mostBlogger, blogs: authors[mostBlogger] }
}

const mostLikes = (blogs) => {
    const authors = {}
    for (blog of blogs) {
        const author = blog.author
        if (!authors[author]) {
            authors[author] = blog.likes
        } else {
            authors[author] += blog.likes
        }
    }
    const mostLikedAuthor = Object.keys(authors).reduce((best, curr) => {
        return authors[curr] > (best ? authors[best] : -Infinity) ? curr : best
    }, "")
    return {author: mostLikedAuthor, likes: authors[mostLikedAuthor]}
}

module.exports = {
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}