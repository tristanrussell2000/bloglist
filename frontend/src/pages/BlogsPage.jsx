import { useQuery, useMutation } from "@tanstack/react-query"
import blogService from '../services/blogs'
import { Link } from "react-router-dom"
import NewBlogForm from "../components/NewBlogForm"

const BlogsPage = () => {
    const blogQuery = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll
    })
    const blogs = blogQuery.data ?? []
    const sortedBlogs = blogs.toSorted((a, b) => {
        return b.likes - a.likes
    })
    
    const deleteMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onMutate: (blogId) => {
            return {blogId}
        },
        onSuccess: (responseData, blogId) => {
            queryClient.setQueryData(["blogs"], (oldBlogs) => {
                return oldBlogs.filter(b => b.id !== blogId)
            })
        },
        onError: (error) => {
            if (error.status === 401) {
                showBanner(error.response.data.error, "red", 5000)
                userDispatch({
                    type: "SET",
                    user: null
                })
            }
        }
    })

    const handleDelete = (id) => {
        const shouldDelete = confirm("Are you sure you want to delete this blog?")
        if (!shouldDelete) return
        deleteMutation.mutate(id)
    }

    return (
        <>
            <h2>Blogs</h2>
            <NewBlogForm/>
            {sortedBlogs.map(blog => {
                return <div key={blog.id} style={{"border": "1px solid black", "paddingTop": "1em", "paddingLeft": "0.5em", "display": "flex"}}>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    <button style={{"marginLeft": "auto", "marginRight": 0}} onClick={() => handleDelete(blog.id)}>Delete</button>
                </div>
            })}
        </>
    )
}

export default BlogsPage