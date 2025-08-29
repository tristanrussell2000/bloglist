import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import blogService from '../services/blogs'
import { Link } from "react-router-dom"
import NewBlogForm from "../components/NewBlogForm"
import {Button, CardList, Card, Section, SectionCard, H2} from "@blueprintjs/core"
import {Bar, ObjectPage, Page, Panel} from '@ui5/webcomponents-react'

const BlogsPage = () => {
    const queryClient = useQueryClient()
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
            console.error(error)
        }
    })

    const handleDelete = (id) => {
        const shouldDelete = confirm("Are you sure you want to delete this blog?")
        if (!shouldDelete) return
        deleteMutation.mutate(id)
    }

    return (
        <div style={{"height": "100vh"}}>

        
        <Page header={<Bar slot="header"> <h2 > Blogs </h2> </Bar>}>
            <Panel>
                <NewBlogForm/>
            </Panel>
            
            <Panel>
                {sortedBlogs.map(blog => {
                    return <Card key={blog.id} >
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        <Button style={{"marginLeft": "auto", "marginRight": 0}} onClick={() => handleDelete(blog.id)}>Delete</Button>
                    </Card>
                })}
            </Panel>
        </Page>
        </div>
    )
}

export default BlogsPage
