import axios from 'axios'

const baseUrl = '/api/blogs'

const newComment = (blogId, comment) => {
    return axios
    .post(`${baseUrl}/${blogId}/comment`, comment)
    .then(response => response.data)
}



export default { newComment }
