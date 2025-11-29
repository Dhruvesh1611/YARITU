"use client";

import React, { useState } from 'react';
import { sanitizeWhatsAppText } from '../utils/whatsapp';
import PropTypes from 'prop-types';

// --- SVG Icon Components (Self-contained and efficient) ---

const WhatsAppIcon = ({ style }) => (
    <svg style={style} viewBox="0 0 90 90" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M90,43.841c0,24.213-19.782,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.218,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-8.001   c-0.876-2.12-1.753-1.822-2.438-1.852c-0.658-0.034-1.424-0.034-2.19-0.034c-0.768,0-2.013,0.269-3.045,1.344   c-1.031,1.075-3.935,3.812-3.935,9.279c0,5.466,4.023,10.766,4.572,11.533c0.546,0.765,7.804,11.977,19.014,16.686   c3.206,1.356,5.633,2.169,7.573,2.768c2.534,0.792,4.841,0.672,6.679-0.405c2.09-1.225,6.41-3.282,7.312-6.453   C68.663,55.131,68.402,54.386,68.129,53.938z" />
    </svg>
);

const CloseIcon = ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" />
        <path d="M6 6L18 18" />
    </svg>
);


/**
 * A professional, reusable WhatsApp chat widget component for your website.
 * It uses a self-contained styles object for easy customization.
 */
export default function WhatsAppChat({
    phoneNumber,
    headerTitle,
    headerCaption,
    placeholder,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    // State for handling hover effects on buttons for a more interactive feel
    const [isToggleHovered, setIsToggleHovered] = useState(false);
    const [isSendHovered, setIsSendHovered] = useState(false);

    /** Toggles the visibility of the chat window */
    const handleToggle = () => setIsOpen(prev => !prev);

    /**
     * Constructs the WhatsApp URL and opens it in a new tab.
     * Resets the input field and closes the widget upon sending.
     */
    const handleSendMessage = () => {
        if (!message.trim()) return;

    const encodedMessage = encodeURIComponent(sanitizeWhatsAppText(message));
        // If phoneNumber is missing, fallback to opening WhatsApp web without a number so user can choose a contact
        const target = phoneNumber ? `https://wa.me/${phoneNumber}?text=${encodedMessage}` : `https://web.whatsapp.com/send?text=${encodedMessage}`;

        // Use 'noopener,noreferrer' for security
        window.open(target, '_blank', 'noopener,noreferrer');

        setMessage('');
        setIsOpen(false);
    };

    /** Handles the key down event in the textarea to send the message on 'Enter' */
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };
    
    // Combine base and hover styles dynamically
    const toggleButtonStyle = {
        ...styles.toggleButton,
        ...(isToggleHovered ? styles.toggleButtonHover : {})
    };
    
    const sendButtonStyle = {
        ...styles.sendButton,
        ...(isSendHovered ? styles.sendButtonHover : {})
    };

    return (
        <div style={styles.container}>
            {/* --- Chat Window --- */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    {/* Header */}
                    <header style={styles.header}>
                        <div style={styles.headerInfo}>
                            <WhatsAppIcon style={styles.headerIcon} />
                            <div>
                                <div style={styles.headerTitle}>{headerTitle}</div>
                                <div style={styles.headerCaption}>{headerCaption}</div>
                            </div>
                        </div>
                        <button onClick={handleToggle} style={styles.closeButton} aria-label="Close chat">
                            <CloseIcon style={{width: 20, height: 20}}/>
                        </button>
                    </header>

                    {/* Message Input Area */}
                    <main style={styles.mainContent}>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            style={styles.textArea}
                            aria-label="Message Input"
                        />
                    </main>
                    
                    {/* Footer with Send Button */}
                    <footer style={styles.footer}>
                        <button 
                            onClick={handleSendMessage} 
                            style={sendButtonStyle}
                            onMouseEnter={() => setIsSendHovered(true)}
                            onMouseLeave={() => setIsSendHovered(false)}
                        >
                            Send
                        </button>
                    </footer>
                </div>
            )}

            {/* --- Floating Toggle Button --- */}
            <button 
                onClick={handleToggle} 
                style={toggleButtonStyle}
                onMouseEnter={() => setIsToggleHovered(true)}
                onMouseLeave={() => setIsToggleHovered(false)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
                aria-expanded={isOpen}
            >
                <WhatsAppIcon style={{ width: 32, height: 32 }} />
            </button>
        </div>
    );
};

// --- Prop Types & Default Props (for reusability and error-checking) ---

WhatsAppChat.propTypes = {
  /** The WhatsApp number to send messages to, including country code (e.g., "911234567890"). */
  phoneNumber: PropTypes.string.isRequired,
  /** The main title displayed in the chat widget header. */
  headerTitle: PropTypes.string,
  /** The caption or subtitle displayed in the header. */
  headerCaption: PropTypes.string,
  /** Placeholder text for the message input area. */
  placeholder: PropTypes.string,
};

WhatsAppChat.defaultProps = {
  headerTitle: "Chat on WhatsApp",
  headerCaption: "We'll reply shortly!",
  placeholder: "Type your message...",
};


// --- Internal CSS using a Styles Object ---

const palette = {
    green: '#25D366',
    teal: '#075E54',
    lightGray: '#F0F2F5',
    textPrimary: '#111B21',
    border: '#E9EDEF',
    white: '#FFFFFF',
    shadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
};

    const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 2000,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    toggleButton: {
        backgroundColor: palette.green,
        color: palette.white,
        width: '56px',
        height: '56px',
        borderRadius: '28px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: palette.shadow,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    },
    toggleButtonHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
    },
    chatWindow: {
        width: '360px',
        maxWidth: 'calc(100vw - 40px)',
        background: palette.white,
        boxShadow: palette.shadow,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
    },
    header: {
        backgroundColor: palette.teal,
        color: palette.white,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    headerIcon: {
        width: '42px',
        height: '42px',
        filter: 'brightness(0) invert(1)',
        flexShrink: 0,
    },
    headerTitle: {
        fontWeight: 700,
        fontSize: '1rem',
    },
    headerCaption: {
        fontSize: '0.8rem',
        opacity: 0.9,
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: palette.white,
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '50%',
    },
    mainContent: {
        padding: '16px',
        backgroundColor: '#f2f2f2',
        flexGrow: 1,
    },
    textArea: {
        width: '100%',
        minHeight: '120px',
        padding: '14px',
        borderRadius: '10px',
        border: `1px solid ${palette.border}`,
        resize: 'vertical',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        fontSize: '0.98rem',
        backgroundColor: palette.white,
        color: palette.textPrimary,
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
    },
    footer: {
        padding: '12px 16px 18px',
        backgroundColor: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.04)'
    },
    sendButton: {
        width: '100%',
        backgroundColor: palette.green,
        color: palette.white,
        border: 'none',
        padding: '16px',
        borderRadius: '8px',
        fontWeight: '700',
        fontSize: '1.05rem',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, transform 0.08s ease',
        boxShadow: '0 6px 18px rgba(37,211,102,0.18)'
    },
    sendButtonHover: {
        backgroundColor: '#1ebf98',
        transform: 'translateY(-1px)'
    },
};