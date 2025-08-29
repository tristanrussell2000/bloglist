import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './contexts/notificationContext'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { UserProvider } from './contexts/userContext'
import { BrowserRouter as Router } from 'react-router-dom'
import {ThemeProvider} from '@ui5/webcomponents-react'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <NotificationProvider>
                <Router>
                    <ThemeProvider>
                        <App/>
                    </ThemeProvider>
                </Router>
            </NotificationProvider>
        </UserProvider>
    </QueryClientProvider>
)