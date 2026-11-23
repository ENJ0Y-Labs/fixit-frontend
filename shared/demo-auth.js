export const DEMO_EMAIL = 'demo@fixit.local';
export const DEMO_PASSWORD = 'FixitDemo123!';

export function isDemoAuthEnabled() {
    return import.meta.env.DEV && (
        import.meta.env.MODE !== 'test' || import.meta.env.VITE_FIXIT_DEMO_AUTH === 'true'
    );
}

export function isDemoCredentials(email, password) {
    return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function createDemoUser(role) {
    const names = {
        customer: 'FixIt Demo Customer',
        provider: 'FixIt Demo Provider',
        admin: 'FixIt Demo Administrator',
    };
    return {
        id: `demo-${role}`,
        name: names[role] ?? 'FixIt Demo User',
        email: DEMO_EMAIL,
        role,
        isDemo: true,
    };
}

export function readDemoSession(role) {
    try {
        const user = JSON.parse(localStorage.getItem(`fixit-demo-session:${role}`) || 'null');
        return user?.isDemo && user.role === role ? user : null;
    } catch {
        return null;
    }
}

export function writeDemoSession(user) {
    localStorage.setItem(`fixit-demo-session:${user.role}`, JSON.stringify(user));
}

export function clearDemoSession(role) {
    localStorage.removeItem(`fixit-demo-session:${role}`);
}
