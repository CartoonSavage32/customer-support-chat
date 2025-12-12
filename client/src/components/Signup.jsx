import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { setToken } from '../utils/auth'
import './Auth.css'

const Signup = ({onLogin}) => {
    const [formData, setFormData] = useState({username: '', email: '', password: '', confirmPassword: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const {
                confirmPassword,
                ...signupData
            } = formData
            const response = await api.post('/auth/signup', signupData)
            setToken(response.data.token)
            onLogin()
            navigate('/chat')
        } catch (err) {
            setError(err.response ?. data ?. error || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>ViralLens</h1>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username"
                            value={
                                formData.username
                            }
                            onChange={handleChange}
                            required
                            placeholder="Choose a username"
                            minLength={3}
                            maxLength={30}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email"
                            value={
                                formData.email
                            }
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password"
                            value={
                                formData.password
                            }
                            onChange={handleChange}
                            required
                            placeholder="Enter your password (min 6 characters)"
                            minLength={6}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                            minLength={6}/>
                    </div>
                    {
                    error && <div className="error-message">
                        {error}</div>
                }
                    <button type="submit"
                        disabled={loading}
                        className="submit-btn">
                        {
                        loading ? 'Creating account...' : 'Sign Up'
                    } </button>
                </form>
                <p className="auth-switch">
                    Already have an account?
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
