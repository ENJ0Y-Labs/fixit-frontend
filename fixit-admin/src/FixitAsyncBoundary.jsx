import { Component } from 'react';

export function FixitLoadingState({ label = 'Loading page' }) {
    return (
        <section className="fixit-loading-state" role="status" aria-live="polite" aria-busy="true">
            <span className="fixit-loading-spinner" aria-hidden="true" />
            <div>
                <strong>{label}</strong>
                <span className="fixit-loading-copy">Preparing this workspace…</span>
            </div>
            <div className="fixit-loading-skeleton" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
        </section>
    );
}

export class FixitAsyncBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.error('FixIt page failed to load:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <section className="fixit-error-state" role="alert">
                    <span className="fixit-error-icon" aria-hidden="true">!</span>
                    <h2>This page could not be opened</h2>
                    <p>The page failed to load. Reload the app to retry its resources. No account data was changed.</p>
                    <button type="button" onClick={() => window.location.reload()}>Reload app</button>
                </section>
            );
        }
        return this.props.children;
    }
}
