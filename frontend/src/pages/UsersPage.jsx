import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import usersService from '../services/blogUsers'
import { H2, HTMLTable, Section, SectionCard } from "@blueprintjs/core"

const UsersTable = ({users}) => {
    return (
        <HTMLTable>
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
        </HTMLTable>
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
        <Section>
            <SectionCard>
                <H2> Users </H2>
                { usersQuery.isLoading && <p> Loading ...</p>}  
                { usersQuery.data && <UsersTable users={usersQuery.data}/>}
            </SectionCard>
        </Section>
    )
}
export default UsersPage