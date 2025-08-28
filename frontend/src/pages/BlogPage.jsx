import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useMatch } from "react-router-dom"
import blogService from '../services/blogs'
import { useState } from "react"
import commentService from '../services/comments'

function BlogPage() {
    const [commentInput, setCommentInput] = useState("")

    const queryClient = useQueryClient()
    const match = useMatch("/blogs/:id")
    const blogId = match.params.id
    const blogQuery = useQuery({
        queryKey: ["blogs", blogId],
        queryFn: () => blogService.getById(blogId),
        initialData: () => {
            return queryClient.getQueryData(["blogs"])?.find(blog => blog.id === blogId)
        },
        initialDataUpdatedAt: () => {
            return queryClient.getQueryState(["blogs"])?.dataUpdatedAt
        }
    })

    const likeMutation = useMutation({
        mutationFn: (updatedBlog) => {
            return blogService.updateBlog(updatedBlog.id, updatedBlog)
        },
        onMutate: async (newBlog) => {
            await queryClient.cancelQueries(["blogs", newBlog.id])
            const previousBlog = queryClient.getQueryData(["blogs", newBlog.id])
            queryClient.setQueryData(["blogs", newBlog.id], (oldBlog) => {
                return oldBlog ? {...oldBlog, likes: newBlog.likes} : oldBlog
            })
            return { previousBlog }
        },
        onSuccess: (newBlog) => {
            // If last request, invalidate and make sure result is correct
            if (queryClient.isMutating() === 1) {  
                queryClient.invalidateQueries({queryKey: ["blogs", newBlog.id]})
            }
        },
        onError: (error, newBlog, context) => {
            queryClient.setQueryData(["blogs", newBlog.id], context.previousBlog)
            queryClient.invalidateQueries({ queryKey: ["blogs", newBlog.id]})
            console.error(error)
        }
    })

    const onLike = () => {
        const updatedBlog = { id: blog.id, likes: blog.likes + 1 }
        likeMutation.mutate(updatedBlog)
    }

    const addCommentMutation = useMutation({
        mutationFn: ({blogId, text}) => commentService.newComment(blogId, {content: text}),
        onSuccess: (newComment, {blogId, text}) => {
            queryClient.invalidateQueries({queryKey: ["blogs", blogId]})
        }
    })

    const onSendComment = (blodId) => {
        addCommentMutation.mutate({blogId, text: commentInput})
        setCommentInput("")
    }


    const blog = blogQuery?.data
    if (!blog) return null
    
    return (
        <div> 
            <h2> {blog.title} </h2>
            {blog.url && <p><a href={blog.url}>{blog.url}</a></p>}
            <p>{blog.likes} likes <button onClick={onLike}>Like</button> </p>
            <p>Added by {blog?.user?.name}</p>
            <div>
                <h3> Comments </h3>
                <div><input value={commentInput} onChange={(e) => setCommentInput(e.target.value)}/><button onClick={() => onSendComment(blog.id)}>Send</button></div>
                <ul>
                    {(blog.comments ?? []).map(comment => {
                        return <li key={comment.id}>{comment.content}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default BlogPage