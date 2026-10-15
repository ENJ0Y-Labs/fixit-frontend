import { useMemo, useState } from 'react';
import './CommunicationAccountPages.css';

function MessageTime({ value }) {
    if (!value) return null;
    const date = new Date(value);
    return <time dateTime={value}>{Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(date)}</time>;
}

export default function MessagesPage({ dataState = 'unconfigured', conversations = [], messagesByConversation = {}, onSendMessage }) {
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState('');
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const filtered = useMemo(() => conversations.filter((item) => {
        const term = query.trim().toLowerCase();
        return !term || [item.customerName, item.jobTitle, item.lastMessage].some((value) => String(value || '').toLowerCase().includes(term));
    }), [conversations, query]);
    const active = filtered.find((item) => item.id === activeId) || conversations.find((item) => item.id === activeId) || filtered[0];
    const messages = active ? (messagesByConversation[active.id] || []) : [];

    async function send(event) {
        event.preventDefault();
        const body = draft.trim();
        if (!body || !active || sending || typeof onSendMessage !== 'function') return;
        setSending(true); setError(''); setNotice('');
        try {
            const result = await onSendMessage(active.id, { body });
            if (!result || result.id == null || typeof result.body !== 'string') {
                setError('The server did not confirm this message. Your draft has been kept.');
                return;
            }
            setDraft(''); setNotice('Message sent and confirmed by the server.');
        } catch (sendError) {
            setError(sendError?.message || 'Message could not be sent. Your draft has been kept so you can retry.');
        } finally { setSending(false); }
    }

    if (dataState === 'loading') return <section className="card comm-state" aria-busy="true"><h1>Messages</h1><p>Loading conversations…</p></section>;
    if (dataState === 'error') return <section className="card comm-state" role="alert"><h1>Messages</h1><p>We couldn’t load your conversations. No messages have been changed.</p></section>;
    if (dataState === 'unconfigured') return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Customer communication</p><h1>Messages</h1><p>Your conversation history will appear here when messaging data is connected.</p></div></div><section className="card comm-unavailable" role="status"><h2>Messaging is not connected</h2><p>No conversations are available from the current workspace. Sending is disabled until a backend message API is connected.</p></section></div>;

    return <div className="communication-page">
        <div className="page-heading"><div><p className="eyebrow">Customer communication</p><h1>Messages</h1><p>Messages are confirmed only when the server returns the saved message.</p></div></div>
        {error && <p className="comm-alert" role="alert">{error}</p>}{notice && <p className="comm-notice" role="status">{notice}</p>}
        {conversations.length === 0 ? <section className="card comm-empty"><h2>No conversations yet</h2><p>When a customer conversation is available to your account, it will appear here.</p></section> : <div className="comm-layout">
            <aside className="card comm-conversations" aria-label="Conversations">
                <label className="form-field"><span>Search conversations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Customer or job" /></label>
                {filtered.length === 0 ? <p className="text-muted">No conversations match this search.</p> : filtered.map((item) => <button className={active?.id === item.id ? 'comm-conversation is-active' : 'comm-conversation'} key={item.id} type="button" onClick={() => { setActiveId(item.id); setError(''); setNotice(''); }}><strong>{item.customerName || 'Customer'}</strong><span>{item.jobTitle || 'Job conversation'}</span><small>{item.lastMessage || 'No messages yet'}</small></button>)}
            </aside>
            <section className="card comm-thread" aria-label={active ? `Conversation with ${active.customerName || 'customer'}` : 'Conversation'}>
                {active ? <><header className="comm-thread-header"><div><h2>{active.customerName || 'Customer'}</h2><p>{active.jobTitle || 'Job conversation'}{active.jobReference ? ` · ${active.jobReference}` : ''}</p></div><span className="status-badge status-neutral">Server status only</span></header>
                    <div className="comm-message-list" aria-live="polite">{messages.length === 0 ? <p className="comm-thread-empty">No messages in this conversation yet.</p> : messages.map((message) => <article className={message.senderRole === 'provider' ? 'comm-message is-provider' : 'comm-message'} key={message.id}><p>{message.body}</p><small>{message.createdAt && <MessageTime value={message.createdAt} />}</small></article>)}</div>
                    <form className="comm-composer" onSubmit={send}><label className="form-field"><span>Write a message</span><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} maxLength={4000} placeholder="Write a clear message to the customer…" disabled={typeof onSendMessage !== 'function' || sending} /></label><div className="comm-composer-footer"><span className="field-hint">{typeof onSendMessage === 'function' ? 'Do not include passwords or payment details.' : 'Sending unavailable until the backend is connected.'}</span><button className="btn btn-primary" type="submit" disabled={!draft.trim() || sending || typeof onSendMessage !== 'function'}>{sending ? 'Sending…' : 'Send message'}</button></div></form>
                </> : <p className="text-muted">Choose a conversation to view messages.</p>}
            </section>
        </div>}
    </div>;
}
