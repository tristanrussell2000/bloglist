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
        <>
            {notification.visible && <Banner message={notification.message} color={notification.color}/>}
            <div style={{"backgroundColor": "grey"}}>
                
                <div style={{"display": "flex", "width": "100%", "paddingLeft": "1em","alignItems": "center", "gap": "1em"}}>
                    <Link  style={{"verticalAlign": "middle"}} to="/">Blogs</Link>
                    <Link  to="/users">Users</Link>
                    <div>
                        {user === null && <LoginForm onBadCredentials={() => showBanner("Error logging in: wrong username or password", "red")}/> }
                        {user !== null && <p>{user.name} logged-in <button onClick={onLogOut}>Log Out</button></p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header