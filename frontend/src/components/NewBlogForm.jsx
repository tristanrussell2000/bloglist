import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import blogService from '../services/blogs'
import { useBanner } from "../contexts/notificationContext"

function NewBlogForm() {
    const [formTitle, setFormTitle] = useState("")
    const [formAuthor, setFormAuthor] = useState("")
    const [visible, setVisible] = useState(false);

    const showBanner = useBanner()

    const queryClient = useQueryClient()
    const addBlogMutation = useMutation({
        mutationFn: blogService.newBlog,
        onSuccess: (newBlog) => {
            queryClient.setQueryData(["blogs"], (oldBlogs) => {
                if (!oldBlogs) return []
                return oldBlogs.concat(newBlog)
            })
        }
    })

    const submitHandler = event => {
        event.preventDefault()
        addBlogMutation.mutate({title: formTitle, author: formAuthor}, {
            onSuccess: (newBlog) => {
                setVisible(false)
                showBanner(`A new blog ${newBlog.title} by ${newBlog.author} was added`, "green")
            }
        })
        setFormTitle("")
        setFormAuthor("")
    }

    const handleClose = (event) => {
        event.preventDefault()
        setVisible(false)
    }

    if (!visible) {
        return <div>
            <button onClick={() => setVisible(true)}>Add</button>
        </div>  
    }
    return (
        <div>
            <h3> Add New Blog </h3>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Title: </label><input name="Title" value={formTitle} onChange={v => setFormTitle(v.target.value)}/>
                </div>
                <div>
                    <label>Author: </label><input name="Author" value={formAuthor} onChange={v => setFormAuthor(v.target.value)}/>
                </div>
                <button type="submit">Add</button>
                <button onClick={handleClose}>Close</button>
            </form>
        </div>
    )
}

export default NewBlogForm