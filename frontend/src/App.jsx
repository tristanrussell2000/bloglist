import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import UserPage from './pages/UserPage'
import BlogPage from './pages/BlogPage'
import BlogsPage from './pages/BlogsPage'

const App = () => {
    return (
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<BlogsPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/users/:id" element={<UserPage/>}/>
                <Route path="/blogs/:id" element={<BlogPage/>}/>
            </Routes>
        </div>
    )
}

export default App
