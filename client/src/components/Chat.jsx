import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import api from '../utils/api'
import './Chat.css'

const Chat = ({onLogout}) => {
    const [messages, setMessages] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [typing, setTyping] = useState(false)
    const [loadingHistory, setLoadingHistory] = useState(true)
    const messagesEndRef = useRef(null)
    const chatContainerRef = useRef(null)

    useEffect(() => {
        loadChatHistory()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, typing])

    const scrollToBottom = () => {
        messagesEndRef.current ?. scrollIntoView({behavior: 'smooth'})
    }

    const loadChatHistory = async () => {
        try {
            const response = await api.get('/chat/history')
            if (response.data.messages && response.data.messages.length > 0) {
                setMessages(response.data.messages)
            }
        } catch (error) {
            console.error('Failed to load chat history:', error)
        } finally {
            setLoadingHistory(false)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!inputMessage.trim() || loading) 
            return

        

        const userMessage = inputMessage.trim()
        setInputMessage('')

        // Add user message immediately
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }
        setMessages(prev => [
            ...prev,
            newUserMessage
        ])
        setLoading(true)
        setTyping(true)

        try {
            const response = await api.post('/chat/send', {message: userMessage})

            // Add AI response
            const aiMessage = {
                role: 'assistant',
                content: response.data.response,
                timestamp: new Date()
            }
            setMessages(prev => [
                ...prev,
                aiMessage
            ])
        } catch (error) {
            const errorMessage = {
                role: 'assistant',
                content: error.response ?. data ?. error || 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [
                ...prev,
                errorMessage
            ])
        } finally {
            setLoading(false)
            setTyping(false)
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) 
            return ''
        
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loadingHistory) {
        return (
            <div className="chat-container">
                <div className="chat-loading">Loading chat history...</div>
            </div>
        )
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>ViralLens Support</h1>
                <button onClick={onLogout}
                    className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="chat-messages"
                ref={chatContainerRef}>
                {
                messages.length === 0 ? (
                    <div className="welcome-message">
                        <h2>Welcome to ViralLens Support!</h2>
                        <p>How can I help you today?</p>
                    </div>
                ) : (messages.map((msg, index) => (
                    <div key={index}
                        className={
                            `message ${
                                msg.role === 'user' ? 'user-message' : 'ai-message'
                            }`
                    }>
                        <div className="message-content">
                            {
                            msg.role === 'assistant' ? (
                                <ReactMarkdown>{
                                    msg.content
                                }</ReactMarkdown>
                            ) : (msg.content)
                        } </div>
                        <div className="message-time">
                            {
                            formatTime(msg.timestamp)
                        } </div>
                    </div>
                )))
            }
                {
                typing && (
                    <div className="message ai-message typing-indicator">
                        <div className="message-content">
                            <span className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </div>
                    </div>
                )
            }
                <div ref={messagesEndRef}/>
            </div>

            <form onSubmit={handleSend}
                className="chat-input-form">
                <input type="text"
                    value={inputMessage}
                    onChange={
                        (e) => setInputMessage(e.target.value)
                    }
                    placeholder="Type your message..."
                    disabled={loading}
                    className="chat-input"/>
                <button type="submit"
                    disabled={
                        loading || !inputMessage.trim()
                    }
                    className="send-btn">
                    {
                    loading ? 'Sending...' : 'Send'
                } </button>
            </form>
        </div>
    )
}

export default Chat
