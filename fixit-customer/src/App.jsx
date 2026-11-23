import { useEffect, useRef, useState } from 'react';
import './styles/pages/jobs.css';
import './styles/pages/account.css';
import './styles/pages/my-jobs.css';
import Nav from './Nav';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';
import Home from './Home.jsx';
import { providers } from './home/providers.js';
import LandingPage from './LandingPage.jsx';
import ProviderProfile from './ProviderProfile.jsx';
import PostJob from './PostJob.jsx';
import MyJobs from './MyJobs.jsx';
import JobDetails from './JobDetails.jsx';
import Payment from './Payment.jsx';
import Review from './Review.jsx';
import Account from './Account.jsx';
import AuthGate from './AuthGate.jsx';
import { customerApi } from './api/customer.js';
import { extractJob, extractJobList, jobErrorMessage } from './api/customerJobs.js';

const PAGE_HASHES = {
    home: 'home',
    myJobs: 'my-jobs',
    postJob: 'post-job',
    jobDetails: 'job-details',
    payment: 'payment',
    review: 'review',
    account: 'account',
    notFound: 'not-found',
};
const HASH_PAGES = Object.fromEntries(Object.entries(PAGE_HASHES).map(([page, hash]) => [hash, page]));

const PAGE_LABELS = {
    home: 'Marketplace',
    myJobs: 'My Jobs',
    postJob: 'Post a Job',
    jobDetails: 'Job Details',
    payment: 'Checkout',
    review: 'Review',
    account: 'My Account',
    notFound: 'Page not found',
};

function getHashPath() {
    return window.location.hash.replace(/^#\/?/, '').split('?')[0];
}

function getPageFromHash() {
    const route = getHashPath();
    return HASH_PAGES[route.split('/')[0]] || (route ? 'notFound' : 'home');
}

function getJobIdFromHash() {
    const match = getHashPath().match(/^job-details\/([^/]+)$/);
    if (!match) return null;
    try { return decodeURIComponent(match[1]); } catch { return match[1]; }
}

function navigateTo(route) {
    const url = window.location.pathname + window.location.search + '#' + route;
    window.history.pushState(window.history.state, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
}

function CustomerWorkspace({ user, onLogout }) {
    const [activePage, setActivePage] = useState(getPageFromHash);
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState('');
    const [jobsReloadKey, setJobsReloadKey] = useState(0);
    const [detailLoading, setDetailLoading] = useState(() => Boolean(getJobIdFromHash()));
    const [detailError, setDetailError] = useState('');
    const [selectedJobId, setSelectedJobId] = useState(getJobIdFromHash);
    const [selectedJob, setSelectedJob] = useState(null);
    const [myJobsViewState, setMyJobsViewState] = useState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
    const hasSyncedInitialRoute = useRef(false);
    const sidebarRef = useRef(null);
    const menuButtonRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const focusable = sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])');
        focusable?.[0]?.focus();
        function trapFocus(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                setMenuOpen(false);
                menuButtonRef.current?.focus();
                return;
            }
            if (event.key !== 'Tab' || !focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        document.addEventListener('keydown', trapFocus);
        return () => {
            document.removeEventListener('keydown', trapFocus);
            if (sidebarRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus();
        };
    }, [menuOpen]);

    useEffect(() => {
        const controller = new AbortController();
        customerApi.listJobs({ limit: 50 }, { signal: controller.signal })
            .then((response) => {
                if (controller.signal.aborted) return;
                setJobs(extractJobList(response));
                setJobsError('');
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setJobs([]);
                setJobsError(jobErrorMessage(error));
            })
            .finally(() => {
                if (!controller.signal.aborted) setJobsLoading(false);
            });
        return () => controller.abort();
    }, [user?.id, jobsReloadKey]);

    useEffect(() => {
        const syncPageWithHash = () => {
            const nextPage = getPageFromHash();
            const nextJobId = getJobIdFromHash();
            setActivePage(nextPage);
            setSelectedJobId(nextJobId);
            if (nextPage === 'jobDetails' && nextJobId) { setDetailLoading(true); setDetailError(''); }
        };
        window.addEventListener('popstate', syncPageWithHash);
        window.addEventListener('hashchange', syncPageWithHash);
        return () => {
            window.removeEventListener('popstate', syncPageWithHash);
            window.removeEventListener('hashchange', syncPageWithHash);
        };
    }, []);

    useEffect(() => {
        const nextHash = activePage === 'jobDetails'
            ? '#job-details' + (selectedJobId ? '/' + encodeURIComponent(selectedJobId) : '')
            : '#' + PAGE_HASHES[activePage];
        if (window.location.hash === nextHash) {
            hasSyncedInitialRoute.current = true;
            return;
        }
        const nextUrl = window.location.pathname + window.location.search + nextHash;
        if (hasSyncedInitialRoute.current) window.history.pushState(window.history.state, '', nextUrl);
        else {
            window.history.replaceState(window.history.state, '', nextUrl);
            hasSyncedInitialRoute.current = true;
        }
    }, [activePage, selectedJobId]);

    useEffect(() => {
        if (activePage !== 'jobDetails') return undefined;
        if (!selectedJobId) return undefined;
        const controller = new AbortController();
        customerApi.getJob(selectedJobId, { signal: controller.signal })
            .then((response) => {
                if (controller.signal.aborted) return;
                const job = extractJob(response);
                if (!job?.id) throw new Error('The server returned an invalid job record.');
                setSelectedJob(job);
                setSelectedJobId(job.id);
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setSelectedJob(null);
                setDetailError(jobErrorMessage(error, 'We could not load this job. Please try again.'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setDetailLoading(false);
            });
        return () => controller.abort();
    }, [activePage, selectedJobId]);

    const navigate = (page, job = null) => {
        const nextPage = PAGE_HASHES[page] ? page : 'home';
        if (job?.id) {
            setSelectedJob(job);
            setSelectedJobId(String(job.id));
        } else if (nextPage === 'jobDetails') {
            setSelectedJob(null);
            setSelectedJobId(null);
            setDetailError('No job was selected. Return to My Jobs and choose a request.');
            setDetailLoading(false);
        } else {
            setSelectedJobId(null);
        }
        if (nextPage === 'jobDetails' && job?.id) {
            setDetailLoading(true);
            setDetailError('');
        }
        setActivePage(nextPage);
        setMenuOpen(false);
    };

    const handleCancelJob = async () => {
        if (!selectedJobId) throw new Error('The selected job could not be identified.');
        const response = await customerApi.cancelJob(selectedJobId);
        const cancelledJob = extractJob(response);
        if (!cancelledJob?.id || cancelledJob.status !== 'CANCELLED') {
            throw new Error('The server did not confirm that this job was cancelled.');
        }
        setJobs((current) => current.some((job) => job.id === cancelledJob.id)
            ? current.map((job) => job.id === cancelledJob.id ? cancelledJob : job)
            : [cancelledJob, ...current]);
        setSelectedJob(cancelledJob);
        navigate('myJobs');
    };

    const handleJobPosted = async (draft) => {
        const response = await customerApi.createJob({
            title: draft.title,
            category: draft.category,
            description: draft.description,
            urgency: draft.urgency,
            preferredDate: draft.date || null,
            preferredTime: draft.time || null,
            serviceLocation: draft.location,
            budget: Number(draft.budget),
        });
        const createdJob = extractJob(response);
        if (!createdJob?.id) throw new Error('The server did not return the saved job. Please refresh My Jobs before trying again.');
        setJobs((current) => [createdJob, ...current.filter((job) => job.id !== createdJob.id)]);
        setJobsError('');
        setJobsLoading(false);
        setMyJobsViewState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
        navigate('myJobs');
    };

    const retryJobDetails = () => {
        if (!selectedJobId) return;
        setDetailLoading(true);
        setDetailError('');
        customerApi.getJob(selectedJobId)
            .then((response) => {
                const job = extractJob(response);
                if (!job?.id) throw new Error('The server returned an invalid job record.');
                setSelectedJob(job);
                setDetailError('');
            })
            .catch((error) => setDetailError(jobErrorMessage(error, 'We could not load this job. Please try again.')))
            .finally(() => setDetailLoading(false));
    };

    const customerName = user?.name || user?.fullName || user?.email || 'Customer account';
    const customerInitials = customerName.split(/[\\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CU';

    const renderPage = () => {
        switch (activePage) {
            case 'myJobs':
                return <MyJobs jobs={jobs} loading={jobsLoading} error={jobsError} onRetry={() => { setJobsLoading(true); setJobsError(''); setJobsReloadKey((current) => current + 1); }} viewState={myJobsViewState} onViewStateChange={setMyJobsViewState} onPostJob={() => navigate('postJob')} onViewDetails={(job) => navigate('jobDetails', job)} />;
            case 'postJob':
                return <PostJob onBack={() => navigate('myJobs')} onJobPosted={handleJobPosted} />;
            case 'jobDetails':
                return <JobDetails job={selectedJob} loading={detailLoading} error={detailError} onRetry={retryJobDetails} onBack={() => navigate('myJobs')} onPayment={() => navigate('payment', selectedJob)} onCancel={handleCancelJob} />;
            case 'payment':
                return <Payment job={selectedJob} onBack={() => navigate('jobDetails', selectedJob)} onPaymentComplete={() => navigate('review', selectedJob)} />;
            case 'review':
                return <Review job={selectedJob} onClose={() => navigate('myJobs')} onSubmit={() => navigate('myJobs')} />;
            case 'account':
                return <Account />;
            case 'notFound':
                return <section className="page-surface" style={{ padding: '64px 36px' }}><p className="eyebrow">CUSTOMER WORKSPACE</p><h1>Page not found</h1><p>The page you requested does not exist.</p><button type="button" className="dark-button" onClick={() => navigate('home')}>Return home</button></section>;
            case 'home':
            default:
                return <Home user={user} isAuthenticated showPublicHeader={false} onNavigate={navigateTo} onAuth={() => {}} onRequireAuth={() => {}} onSelectProvider={(provider) => navigateTo('provider/' + provider.id)} />;
        }
    };

    return (
        <div className="customer-workspace-shell">
            <Nav activePage={activePage} onNavigate={navigate} user={user} onLogout={onLogout} isOpen={menuOpen} onClose={() => setMenuOpen(false)} sidebarRef={sidebarRef} />
            <button className={`customer-nav-backdrop${menuOpen ? ' is-visible' : ''}`} type="button" aria-label="Close navigation menu" tabIndex={menuOpen ? 0 : -1} onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }} />
            <main className="customer-workspace-main">
                <header className="customer-workspace-topbar">
                    <div className="customer-topbar-left">
                        <button ref={menuButtonRef} className="customer-menu-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="customer-navigation" onClick={() => setMenuOpen((open) => !open)}>
                            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
                        </button>
                        <p className="customer-breadcrumb">FixIt <span aria-hidden="true">/</span> {PAGE_LABELS[activePage] || 'Customer workspace'}</p>
                    </div>
                    <div className="customer-topbar-actions">
                        <span className="customer-workspace-tag">CUSTOMER</span>
                        <button className="customer-topbar-icon" type="button" aria-label="Notifications are not connected" disabled><i className="fa-regular fa-bell" aria-hidden="true" /></button>
                        <span className="customer-topbar-avatar" aria-label={customerName}>{customerInitials}</span>
                    </div>
                </header>
                <div className="customer-workspace-content">
                <FixitAsyncBoundary key={activePage}>
                    <div key={activePage} className="fixit-page-transition">{renderPage()}</div>
                </FixitAsyncBoundary>
                </div>
            </main>
        </div>
    );
}

function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return 'landing';
    const route = hash.split('?')[0];
    return route === 'home' ? 'marketplace' : route;
}

const protectedRoutes = ['my-jobs', 'post-job', 'job-details', 'payment', 'review', 'account'];

function PublicExperience({ route, user, openAuth, requireAuth }) {
    const navigate = (nextRoute) => navigateTo(nextRoute);
    const match = route.match(/^provider\/([^/]+)$/);
    if (match) return <ProviderProfile provider={providers.find((provider) => provider.id === match[1])} user={user} onNavigate={navigate} onAuth={openAuth} onRequireAuth={requireAuth} />;
    if (route === 'marketplace') return <Home user={user} isAuthenticated={Boolean(user)} onNavigate={navigate} onAuth={openAuth} onRequireAuth={requireAuth} onSelectProvider={(provider) => navigate('provider/' + provider.id)} />;
    return <LandingPage user={user} onNavigate={navigate} onAuth={openAuth} />;
}

function FixitApp({ user, onLogout, openAuth, requireAuth }) {
    const [route, setRoute] = useState(getRouteFromHash);
    useEffect(() => {
        const sync = () => setRoute(getRouteFromHash());
        window.addEventListener('popstate', sync);
        window.addEventListener('hashchange', sync);
        return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
    }, []);
    const routeKey = route.split('/')[0];
    if (user && protectedRoutes.includes(routeKey)) return <CustomerWorkspace key={user.id || user.email || 'customer'} user={user} onLogout={onLogout} />;
    return <PublicExperience route={route} user={user} openAuth={openAuth} requireAuth={requireAuth} />;
}

export default function App() {
    return <AuthGate>{(auth) => <FixitApp {...auth} />}</AuthGate>;
}
