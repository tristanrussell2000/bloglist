import { useState } from "react"
import loginService from '../services/login'
import blogService from "../services/blogs"
import { useUserDispatch } from "../contexts/userContext"

function LoginForm({onBadCredentials}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const userDispatch = useUserDispatch()

    const handleLogin = async () => {
        try {
            const user = await loginService.login({
                username, password
            })
            window.localStorage.setItem(
                'loggedInBlogUser', JSON.stringify(user)
            )
            userDispatch({
                type: "SET",
                user
            })
            blogService.setToken(user.token)
            setUsername("")
            setPassword("")
        } catch (exception) {
            if (exception?.status === 401) {
                onBadCredentials()
                console.error(exception)
                return
            }
            console.error(exception)
        }
    }

    return (
        <div>
            <label>Username: </label>
            <input style={{"marginRight": "1em"}} type="text" name="Username" value={username} onChange={event => setUsername(event.target.value)}/>
            <label>Password: </label>
            <input type="password" name="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
            <button type="submit" onClick={handleLogin}>Log In</button>
        </div>
    )
}

export default LoginForm