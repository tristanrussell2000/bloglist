import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import usersService from '../services/blogUsers'

const UsersTable = ({users}) => {
    return (
        <table>
            <thead>
                <tr>
                    <td><b> Name</b> </td>
                    <td><b>Blogs Created</b></td>
                </tr>
            </thead>
            <tbody>
                {users.map(user => {
                    return <tr key={user.name}>
                        <td>
                            <Link to={`/users/${user.id}`}>{user.name}</Link>
                        </td>
                        <td>
                            {user.blogs?.length ?? 0}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    )
}

const UsersPage = () => {
    const usersQuery = useQuery({
        queryKey: ["users"],
        queryFn: usersService.getAll
    })

    if (usersQuery.isLoading) {
        return <div></div>
    }

    return (
        <div>
            <h2> Users </h2>
            { usersQuery.isLoading && <p> Loading ...</p>}  
            { usersQuery.data && <UsersTable users={usersQuery.data}/>}
        </div>
    )
}
export default UsersPage