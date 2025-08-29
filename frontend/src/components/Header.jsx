import { useEffect } from "react"
import { useBanner, useNotification } from "../contexts/notificationContext"
import { useUser, useUserDispatch } from "../contexts/userContext"
import blogService from '../services/blogs'
import Banner from "./Banner"
import LoginForm from "./LoginForm"
import { Link } from 'react-router-dom'
import { Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core"

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
            <Navbar>
                <NavbarGroup>
                    <Link  to="/">Blogs</Link>
                    <NavbarDivider/>
                    <Link  to="/users">Users</Link>
                    <NavbarDivider/>
                    <NavbarHeading>
                        {user === null && <LoginForm onBadCredentials={() => showBanner("Error logging in: wrong username or password", "red")}/> }
                        {user !== null && <>{user.name} logged-in <button onClick={onLogOut}>Log Out</button></>}
                    </NavbarHeading>
                </NavbarGroup>
            </Navbar>
        </>
    )
}

export default Header