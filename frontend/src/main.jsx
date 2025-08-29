import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationProvider } from './contexts/notificationContext'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { UserProvider } from './contexts/userContext'
import { BrowserRouter as Router } from 'react-router-dom'
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
// include blueprint-icons.css for icon font support
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <NotificationProvider>
                <Router>
                    <App/>
                </Router>
            </NotificationProvider>
        </UserProvider>
    </QueryClientProvider>
)