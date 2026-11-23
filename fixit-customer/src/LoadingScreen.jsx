import { useState } from 'react';

export default function LoadingScreen() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div
            className="fixit-brand-splash"
            role="status"
            aria-label="Loading FixIt"
            onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) setVisible(false);
            }}
        >
            <img className="fixit-brand-splash-logo" src="/brand/logo.svg" alt="" />
            <strong className="fixit-brand-splash-name">FixIt</strong>
            <p className="fixit-brand-splash-tagline">Trusted help for every home.</p>
            <span className="fixit-brand-splash-loader" aria-hidden="true" />
        </div>
    );
}
