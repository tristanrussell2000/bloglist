import { createContext, useReducer, useContext } from "react";

export const NotificationContext = createContext(null)
export const NotificationDispatchContext = createContext(null)

export function NotificationProvider({children}) {
    const [notification, dispatch] = useReducer(notificationReducer, {})

    return (
        <NotificationContext.Provider value={notification}>
            <NotificationDispatchContext.Provider value={dispatch}>
                {children}
            </NotificationDispatchContext.Provider>
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    return useContext(NotificationContext)
}

export function useNotificationDispatch() {
    return useContext(NotificationDispatchContext)
}

export const notificationReducer = (notification, action) => {
    switch (action.type) {
        case "SET":
            return action.notification
        default:
            return notification
    }
}

export const useBanner = () => {
    const dispatch = useNotificationDispatch()

    return (message, color, time = 5000) => {
        dispatch({
            type: "SET",
            notification: {
                message,
                color,
                visible: true
            }
        })
        setTimeout(() => {
            dispatch({
                type:"SET",
                notification: {
                    message, color, visible: false
                }
            })
        }, time)
    }
}
