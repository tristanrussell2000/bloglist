import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getById = (blogId) => {
    const request = axios.get(`${baseUrl}/${blogId}`)
    return request.then(response => response.data)
}

const newBlog = (blog) => {
    const config = {
        headers: {Authorization: token}
    }
    return axios
    .post(baseUrl, blog, config)
    .then(response => response.data)
}

const updateBlog = (id, blogUpdate) => {
    const config = {
        headers: {Authorization: token}
    }
    return axios
    .patch(`${baseUrl}/${id}`, blogUpdate, config)
    .then(response => response.data)
}

const deleteBlog = (id) => {
    const config = {
        headers: {Authorization: token}
    }
    return axios
    .delete(`${baseUrl}/${id}`, config)
}


export default { getAll, getById, newBlog, setToken, updateBlog, deleteBlog}
