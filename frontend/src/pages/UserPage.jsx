import { useQuery } from "@tanstack/react-query"
import { useMatch } from "react-router-dom"
import usersService from '../services/blogUsers'

const UserPage = () => {
    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: usersService.getAll
    })
    const match = useMatch("/users/:id")
    const userId = match.params.id
    const users = usersQuery.data ?? []
    const user = users.find(u => u.id === userId)
    if (!user) {
        return null
    }
    const blogs = user.blogs ?? []
    return (
        <div>
            <h2> {user?.name} </h2>
            <h3> Added Blogs </h3>
            <ul>
                {blogs.map(blog => {
                    return <li key={blog.id}>{blog.title}</li>
                })}
            </ul>
        </div>
    )
}

export default UserPage