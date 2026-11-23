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
    };

    const handleCancelJob = async () => {
        if (!selectedJobId) throw new Error('The selected job could not be identified.');
        const response = await customerApi.cancelJob(selectedJobId);
        const cancelledJob = extractJob(response);
        if (!cancelledJob?.id || cancelledJob.status !== 'CANCELLED') {
            throw new Error('The server did not confirm that this job was cancelled.');
        }
        setJobs((current) => current.map((job) => job.id === cancelledJob.id ? cancelledJob : job));
        setSelectedJob(cancelledJob);
        navigate('myJobs');
    };

    const handleJobPosted = async () => {
        setMyJobsViewState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
        setJobsLoading(true);
        setJobsError('');
        setJobsReloadKey((current) => current + 1);
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
                return <Home user={user} isAuthenticated onNavigate={navigateTo} onAuth={() => {}} onRequireAuth={() => {}} onSelectProvider={(provider) => navigateTo('provider/' + provider.id)} />;
        }
    };

    return (
        <div className="app-shell">
            <Nav activePage={activePage} onNavigate={navigate} user={user} onLogout={onLogout} />
            <div className="app-content">
                <FixitAsyncBoundary key={activePage}>
                    <div key={activePage} className="fixit-page-transition">{renderPage()}</div>
                </FixitAsyncBoundary>
            </div>
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
