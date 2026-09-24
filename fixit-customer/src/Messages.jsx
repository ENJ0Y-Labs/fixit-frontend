import { useMemo, useState } from 'react';
import avatarPlaceholder from './assets/avatar-placeholder.svg';
import './Messages.css';

const conversations = [
    {
        id: 'emeka',
        name: 'Emeka Nwachukwu',
        role: 'Professional Plumber',
        job: 'JOB: Fixing Kitchen Sink Leak',
        preview: 'Hello! I have seen the photos you uploaded. I can be there by 10–30 AM tomorrow. Does that work for you?',
        time: '09:18 AM',
        date: 'Today, Feb 21',
        online: true,
        messages: [
            {
                id: 1,
                from: 'system',
                text: 'Please keep all communication and payments on FixIt. Never share sensitive personal details outside the app.',
            },
            {
                id: 2,
                from: 'other',
                text: 'Hello! I’ve seen the photos you uploaded. I can be there by 10:30 AM tomorrow. Does that work for you?',
                time: '09:18 AM',
            },
            {
                id: 3,
                from: 'me',
                text: 'Yes, that works. Please ensure you bring everything necessary to fix a pipe replacement. I have the replacement joint ready but check if you need anything else.',
                time: '09:25 AM',
            },
            {
                id: 4,
                from: 'other',
                text: 'Absolutely! I’ll bring the standard joints. If we need something specialized, there’s a hardware store nearby I can use. Just to confirm, is it this type of joint?',
                time: '09:26 AM',
                attachment: true,
            },
        ],
    },
    {
        id: 'chioma',
        name: 'Chioma Adeyemi',
        role: 'Expert Cleaner',
        job: 'JOB: Deep House Cleaning',
        preview: 'Thank you for the five-star rating! It was a pleasure helping you.',
        time: 'Yesterday',
        online: false,
        messages: [
            {
                id: 1,
                from: 'other',
                text: 'Thank you for the five-star rating! It was a pleasure helping you.',
                time: 'Yesterday',
            },
        ],
    },
    {
        id: 'tunde',
        name: 'Tunde Bello',
        role: 'Master Electrician',
        job: 'JOB: Circuit Breaker Tripping',
        preview: 'I can be there tomorrow morning at 9 AM.',
        time: '12 Feb',
        online: false,
        messages: [
            {
                id: 1,
                from: 'other',
                text: 'I can be there tomorrow morning at 9 AM.',
                time: '12 Feb',
            },
        ],
    },
];

function Messages({ selectedJob, onViewJob }) {
    const [activeId, setActiveId] = useState(() => {
        const match = conversations.find((conversation) => conversation.name === selectedJob?.provider);
        return match?.id ?? 'emeka';
    });
    const [draft, setDraft] = useState('');
    const [sentMessages, setSentMessages] = useState({});

    const activeConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
        [activeId]
    );

    const visibleMessages = [
        ...activeConversation.messages,
        ...(sentMessages[activeConversation.id] ?? []),
    ];

    const handleSend = () => {
        const text = draft.trim();

        if (!text) {
            return;
        }

        setSentMessages((current) => ({
            ...current,
            [activeConversation.id]: [
                ...(current[activeConversation.id] ?? []),
                {
                    id: Date.now(),
                    from: 'me',
                    text,
                    time: 'Just now',
                },
            ],
        }));
        setDraft('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="messages-page">
            <section className="messages-list-panel" aria-label="Conversations">
                <header className="messages-list-header">
                    <h1>Messages</h1>
                    <div className="messages-search">
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <input type="search" placeholder="Search conversations..." aria-label="Search conversations" />
                    </div>
                </header>

                <div className="conversation-list">
                    {conversations.map((conversation) => {
                        const isActive = conversation.id === activeId;

                        return (
                            <button
                                type="button"
                                className={`conversation-item${isActive ? ' is-active' : ''}`}
                                key={conversation.id}
                                onClick={() => setActiveId(conversation.id)}
                            >
                                <div className="conversation-avatar">
                                    <img src={avatarPlaceholder} alt="" />
                                    {conversation.online && <span aria-label="Online"></span>}
                                </div>
                                <div className="conversation-copy">
                                    <div className="conversation-topline">
                                        <strong>{conversation.name}</strong>
                                        <time>{conversation.time}</time>
                                    </div>
                                    <p className="conversation-job">{conversation.job}</p>
                                    <p className="conversation-preview">{conversation.preview}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="chat-panel" aria-label={`Conversation with ${activeConversation.name}`}>
                <header className="chat-header">
                    <div className="chat-person">
                        <div className="chat-avatar">
                            <img src={avatarPlaceholder} alt="" />
                            {activeConversation.online && <span></span>}
                        </div>
                        <div>
                            <strong>{activeConversation.name}</strong>
                            <p>
                                <span>ACTIVE NOW</span>
                                <small>{activeConversation.role}</small>
                            </p>
                        </div>
                    </div>

                    <div className="chat-header-actions">
                        <button type="button" aria-label="Call provider">
                            <i className="fa-solid fa-phone"></i>
                        </button>
                        <button type="button" aria-label="View job" onClick={onViewJob}>
                            <i className="fa-solid fa-briefcase"></i>
                        </button>
                        <button type="button" aria-label="More options">
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                </header>

                <div className="chat-job-banner">
                    <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                    <div>
                        <strong>Stay Safe on FixIt</strong>
                        <p>Never share personal contact details or make payments outside the platform. We make sure you’re protected.</p>
                    </div>
                </div>

                <div className="chat-messages">
                    <div className="chat-date">{activeConversation.date ?? 'Today'}</div>

                    {visibleMessages.map((message) => (
                        <div className={`message-row message-row--${message.from}`} key={message.id}>
                            {message.from === 'other' && (
                                <img className="message-avatar" src={avatarPlaceholder} alt="" />
                            )}

                            <div className="message-stack">
                                <div className="message-bubble">
                                    <p>{message.text}</p>
                                    {message.attachment && (
                                        <div className="message-attachment" aria-label="Attached image preview">
                                            <i className="fa-solid fa-image"></i>
                                        </div>
                                    )}
                                </div>
                                {message.time && <time>{message.time}</time>}
                            </div>

                            {message.from === 'me' && (
                                <img className="message-avatar" src={avatarPlaceholder} alt="" />
                            )}
                        </div>
                    ))}
                </div>

                <form
                    className="message-composer"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSend();
                    }}
                >
                    <button type="button" aria-label="Attach file">
                        <i className="fa-solid fa-paperclip"></i>
                    </button>
                    <button type="button" aria-label="Attach image">
                        <i className="fa-regular fa-image"></i>
                    </button>
                    <div className="composer-input">
                        <input
                            type="text"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            aria-label="Type your message"
                        />
                        <i className="fa-regular fa-face-smile" aria-hidden="true"></i>
                    </div>
                    <button className="send-button" type="submit">
                        Send <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </section>

            <aside className="job-context-panel" aria-label="Job context">
                <div className="job-context-heading">
                    <span>JOB CONTEXT</span>
                </div>

                <article className="context-job-card">
                    <h2>{selectedJob?.title || 'Fixing Kitchen Sink Leak'}</h2>
                    <span className="context-status">IN PROGRESS</span>

                    <dl>
                        <div>
                            <dt>AGREED PRICE</dt>
                            <dd>₦{(selectedJob?.price || 12500).toLocaleString('en-NG')}</dd>
                        </div>
                        <div>
                            <dt>SCHEDULED</dt>
                            <dd>Feb 21, 10:30 AM</dd>
                        </div>
                    </dl>

                    <button type="button">VIEW JOB DETAILS</button>
                </article>

                <section className="context-media">
                    <h2>MEDIA &amp; FILES</h2>
                    <div className="media-grid">
                        <div><i className="fa-regular fa-image"></i></div>
                        <div><i className="fa-regular fa-image"></i></div>
                        <div><i className="fa-regular fa-image"></i></div>
                    </div>
                    <button type="button">VIEW ALL MEDIA</button>
                </section>

                <button type="button" className="report-provider">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    REPORT PROVIDER
                </button>
            </aside>
        </div>
    );
}

export default Messages;
