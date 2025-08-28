function info (...params) {
    if (process.env.NODE_ENV === 'test') return
    console.log(...params)
}

function error(...params) {
    if (process.env.NODE_ENV === 'test') return
    console.error(...params)
}

module.exports = {info, error}