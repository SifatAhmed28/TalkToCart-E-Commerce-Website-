import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { FaMicrophone, FaStop, FaPaperPlane, FaRobot, FaTimes, FaCommentDots } from 'react-icons/fa';

const VoiceAssistant = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your TalkToCart assistant. How can I help you?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // --- SPEAK FUNCTION ---
    const speak = (text) => {
        // Cancel previous speech to avoid overlapping
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        window.speechSynthesis.speak(utterance);
    };

    const commands = [
        {
            command: 'go to home',
            callback: () => {
                navigate('/');
                speak("Going home.");
            }
        },
        {
            command: 'go to cart',
            callback: () => {
                navigate('/cart');
                speak("Opening cart.");
            }
        },
        {
            command: 'stop',
            callback: () => {
                window.speechSynthesis.cancel();
            }
        },
    ];

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender }]);
    };

    // --- API CALL ---
    const processQuery = async (query) => {
        setIsThinking(true);
        try {
            console.log(`📤 Sending query to backend: ${query}`);

            const { data } = await axios.post('/api/chat', {
                userMessage: query
            }, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (data.success === false) {
                throw new Error(data.reply || 'AI service error');
            }

            console.log(`📥 Received response: ${data.reply.substring(0, 50)}...`);
            addMessage(data.reply, 'ai');
            speak(data.reply);
        } catch (error) {
            console.error("🔥 Frontend Error:", error);

            let errorMessage = "I'm having trouble connecting. Please try again.";

            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timed out. Please check your connection.";
            } else if (error.response) {
                // Server responded with error status
                console.error("Server Error Data:", error.response.data);
                errorMessage = error.response.data.reply || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // No response received
                console.error("No response received");
                errorMessage = "Cannot connect to server. Make sure backend is running.";
            }

            addMessage(errorMessage, 'ai');
            speak(errorMessage);
        }
        setIsThinking(false);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const query = inputText;
        setInputText('');
        addMessage(query, 'user');
        await processQuery(query);
    };

    const handleVoiceStop = async () => {
        SpeechRecognition.stopListening();
        if (transcript) {
            addMessage(transcript, 'user');
            await processQuery(transcript);
        }
        resetTranscript();
    };

    if (!browserSupportsSpeechRecognition) return null;

    // Styles
    const containerStyle = { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' };
    const chatWindowStyle = { width: '350px', height: '500px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', display: isOpen ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', marginBottom: '15px' };
    const fabStyle = { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: 'none', fontSize: '24px' };

    return (
        <div style={containerStyle}>
            <div style={chatWindowStyle}>
                {/* Header */}
                <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
                    <span><FaRobot /> Assistant</span>
                    <FaTimes style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#2563eb' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'black',
                            padding: '10px', borderRadius: '10px', maxWidth: '80%'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {isThinking && <div style={{ color: 'gray', fontStyle: 'italic' }}>Typing...</div>}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '10px', display: 'flex', gap: '5px', borderTop: '1px solid #eee' }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        style={{ flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ddd' }}
                    />
                    {listening ? (
                        <button onClick={handleVoiceStop} style={{ color: 'red', border: 'none', background: 'none', fontSize: '20px' }}><FaStop /></button>
                    ) : (
                        <button onClick={SpeechRecognition.startListening} style={{ color: '#555', border: 'none', background: 'none', fontSize: '20px' }}><FaMicrophone /></button>
                    )}
                    <button onClick={handleSend} style={{ color: '#2563eb', border: 'none', background: 'none', fontSize: '20px' }}><FaPaperPlane /></button>
                </div>
            </div>

            <button style={fabStyle} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaCommentDots />}
            </button>
        </div>
    );
};

export default VoiceAssistant;
