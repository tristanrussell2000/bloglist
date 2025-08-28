import { useEffect } from "react"
import { useBanner, useNotification } from "../contexts/notificationContext"
import { useUser, useUserDispatch } from "../contexts/userContext"
import blogService from '../services/blogs'
import Banner from "./Banner"
import LoginForm from "./LoginForm"
import { Link } from 'react-router-dom'

function Header() {
    const user = useUser()
    const userDispatch = useUserDispatch()
    const notification = useNotification()
    const showBanner = useBanner()

    useEffect(() => {
        const loggedInUserJson = window.localStorage.getItem('loggedInBlogUser')
        if (loggedInUserJson) {
            const newUser = JSON.parse(loggedInUserJson)
            userDispatch({
                type: "SET",
                user: newUser
            })
            blogService.setToken(newUser.token)
        }
    }, [])

    const onLogOut = () => {
        userDispatch({
            type:"SET",
            user: null
        })
        blogService.setToken(null)
        window.localStorage.removeItem('loggedInBlogUser')
    }

    return (
        <div>
            {notification.visible && <Banner message={notification.message} color={notification.color}/>}
            {user !== null && <p>{user.name} logged-in <button onClick={onLogOut}>Log Out</button></p>}
            {user === null && <LoginForm onBadCredentials={() => showBanner("Error logging in: wrong username or password", "red")}/> }
            <div style={{"display": "flex", "width": "100%"}}>
                <Link style={{"padding": "10px", "border": "1px solid black"}} to="/">Blogs</Link>
                <Link style={{"padding": "10px", "border": "1px solid black"}} to="/users">Users</Link>
            </div>
        </div>
    )
}

export default Header