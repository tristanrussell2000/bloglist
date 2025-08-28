import { useState } from "react"
import loginService from '../services/login'
import blogService from "../services/blogs"
import { useUserDispatch } from "../contexts/userContext"

function LoginForm({onBadCredentials}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const userDispatch = useUserDispatch()

    const handleLogin = async event => {
        event.preventDefault()
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
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username: </label>
                    <input type="text" name="Username" value={username} onChange={event => setUsername(event.target.value)}/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" name="Password" value={password} onChange={event=>setPassword(event.target.value)}/>
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LoginForm