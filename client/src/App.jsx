import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Chat from './components/Chat'
import Login from './components/Login'
import Signup from './components/Signup'
import { getToken, removeToken } from './utils/auth'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getToken()
        setIsAuthenticated(!! token)
        setLoading(false)
    }, [])

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        removeToken()
        setIsAuthenticated(false)
    }

    if (loading) {
        return (
            <div style={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: 'white'
                }
            }>
                Loading...
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/chat" replace/>
                        ) : (
                            <Login onLogin={handleLogin}/>
                        )
                    }/>
                <Route path="/signup"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/chat" replace/>
                        ) : (
                            <Signup onLogin={handleLogin}/>
                        )
                    }/>
                <Route path="/chat"
                    element={
                        isAuthenticated ? (
                            <Chat onLogout={handleLogout}/>
                        ) : (
                            <Navigate to="/login" replace/>
                        )
                    }/>
                <Route path="/"
                    element={<Navigate
                        to={
isAuthenticated ? "/chat" : "/login"}
                    replace/>}/>
            </Routes>
        </Router>
    )
}

export default App
