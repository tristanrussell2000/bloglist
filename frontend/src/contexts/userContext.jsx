import { createContext, useReducer, useContext } from "react";

export const UserContext = createContext(null)
export const UserDispatchContext = createContext(null)

export function UserProvider({children}) {
    const [user, dispatch] = useReducer(userReducer, null)

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}

export function useUserDispatch() {
    return useContext(UserDispatchContext)
}

export const userReducer = (user, action) => {
    switch (action.type) {
        case "SET":
            return action.user
        default:
            return user
    }
}