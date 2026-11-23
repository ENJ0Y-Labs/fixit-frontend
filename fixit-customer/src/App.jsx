import { useEffect, useRef, useState } from 'react';
import './styles/pages/jobs.css';
import './styles/pages/account.css';
import './styles/pages/my-jobs.css';
import Nav from './Nav';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';
import Home, { providers } from './Home.jsx';
import LandingPage from './LandingPage.jsx';
import ProviderProfile from './ProviderProfile.jsx';
import PostJob from './PostJob.jsx';
import MyJobs from './MyJobs.jsx';
import JobDetails from './JobDetails.jsx';
import Payment from './Payment.jsx';
import Review from './Review.jsx';
import Account from './Account.jsx';
import AuthGate from './AuthGate.jsx';

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

const HASH_PAGES = Object.fromEntries(
    Object.entries(PAGE_HASHES).map(([page, hash]) => [hash, page]),
);

function getPageFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    return HASH_PAGES[hash] || (hash ? 'notFound' : 'home');
}

const initialJobs = [
    {
        id: 'JOB-09123',
        icon: 'fa-solid fa-faucet',
        category: 'PLUMBING',
        status: 'IN PROGRESS',
        title: 'Fixing Kitchen Sink Leak',
        dateStr: 'Sat, 21 Feb 2026',
        location: 'Victoria Island, Lagos',
        priceLabel: 'AGREED PRICE',
        priceValue: 12500,
        priceSubtext: 'Escrow Secured',
        providerName: 'Emeka Nwachukwu',
        progressPercentage: 75,
    },
    {
        id: 'JOB-09124',
        icon: 'fa-solid fa-bolt',
        category: 'ELECTRICAL',
        status: 'AWAITING BIDS',
        title: 'Circuit Breaker Tripping Frequently',
        dateStr: 'Mon, 23 Feb 2026',
        location: 'Ikeja, Lagos',
        priceLabel: 'EST. BUDGET',
        minBudget: 8000,
        maxBudget: 15000,
        priceValue: 8000,
        bidNo: 3,
        providerName: 'Tunde Bello',
    },
    {
        id: 'JOB-09125',
        icon: 'fa-solid fa-broom',
        category: 'CLEANING',
        status: 'COMPLETED',
        title: 'Deep House Cleaning (3BR)',
        dateStr: 'Wed, 10 Feb 2026',
        location: 'Surulere, Lagos',
        priceLabel: 'PAID AMOUNT',
        priceValue: 25000,
        providerName: 'Chioma Adeyemi',
        providerRating: 5,
    },
];

function CustomerWorkspace({ user, onLogout }) {
    const [activePage, setActivePage] = useState(getPageFromHash);
    const [jobs, setJobs] = useState(initialJobs);
    const [myJobsViewState, setMyJobsViewState] = useState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
    const [selectedJob, setSelectedJob] = useState(initialJobs[0]);
    const hasSyncedInitialRoute = useRef(false);

    useEffect(() => {
        const syncPageWithHash = () => setActivePage(getPageFromHash());
        window.addEventListener('popstate', syncPageWithHash);
        window.addEventListener('hashchange', syncPageWithHash);
        return () => {
            window.removeEventListener('popstate', syncPageWithHash);
            window.removeEventListener('hashchange', syncPageWithHash);
        };
    }, []);

    useEffect(() => {
        const nextHash = `#${PAGE_HASHES[activePage]}`;
        if (window.location.hash === nextHash) {
            hasSyncedInitialRoute.current = true;
            return;
        }

        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
        if (hasSyncedInitialRoute.current) {
            window.history.pushState(window.history.state, '', nextUrl);
        } else {
            window.history.replaceState(window.history.state, '', nextUrl);
            hasSyncedInitialRoute.current = true;
        }
    }, [activePage]);

    const navigate = (page, job = selectedJob) => {
        const nextPage = PAGE_HASHES[page] ? page : 'home';
        if (job) setSelectedJob(job);
        setActivePage(nextPage);
    };

    const handleCancelJob = (job) => {
        const cancelledJob = { ...job, status: 'CANCELLED', progressPercentage: 0 };
        setJobs((current) => {
            const exists = current.some((item) => item.id === job.id);
            return exists
                ? current.map((item) => item.id === job.id ? cancelledJob : item)
                : [cancelledJob, ...current];
        });
        navigate('myJobs', cancelledJob);
    };

    const handleJobPosted = (job) => {
        const newJob = {
            id: job.id,
            icon: job.category === 'Electrical'
                ? 'fa-solid fa-bolt'
                : job.category === 'Cleaning'
                    ? 'fa-solid fa-broom'
                    : job.category === 'Carpentry'
                        ? 'fa-solid fa-hammer'
                        : job.category === 'Painting'
                            ? 'fa-solid fa-paint-roller'
                            : 'fa-solid fa-faucet',
            category: job.category.toUpperCase(),
            status: 'AWAITING BIDS',
            title: job.title,
            dateStr: job.dateStr,
            location: job.location,
            priceLabel: 'EST. BUDGET',
            priceValue: Number(job.budget) || 0,
            minBudget: Number(job.budget) || 0,
            maxBudget: Number(job.budget) || 0,
            bidNo: 0,
        };

        setJobs((current) => [newJob, ...current]);
        setMyJobsViewState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
        navigate('myJobs', newJob);
    };

    const selectedJobFromState = jobs.find((job) => job.id === selectedJob?.id) || selectedJob;

    const renderPage = () => {
        switch (activePage) {
            case 'myJobs':
                return (
                    <MyJobs
                        jobs={jobs}
                        viewState={myJobsViewState}
                        onViewStateChange={setMyJobsViewState}
                        onPostJob={() => navigate('postJob')}
                        onViewDetails={(job) => navigate('jobDetails', job)}
                    />
                );
            case 'postJob':
                return (
                    <PostJob
                        onBack={() => navigate('myJobs')}
                        onJobPosted={handleJobPosted}
                    />
                );
            case 'jobDetails':
                return (
                    <JobDetails
                        job={selectedJobFromState}
                        onBack={() => navigate('myJobs', selectedJobFromState)}
                        onPayment={() => navigate('payment', selectedJobFromState)}
                        onCancel={() => handleCancelJob(selectedJobFromState)}
                    />
                );
            case 'payment':
                return (
                    <Payment
                        job={selectedJobFromState}
                        onBack={() => navigate('jobDetails', selectedJobFromState)}
                        onPaymentComplete={() => navigate('review', selectedJobFromState)}
                    />
                );
            case 'review':
                return (
                    <Review
                        job={selectedJobFromState}
                        onClose={() => navigate('myJobs', selectedJobFromState)}
                        onSubmit={() => navigate('myJobs', selectedJobFromState)}
                    />
                );
            case 'account':
                return <Account />;
            case 'notFound':
                return <section className="page-surface" style={{ padding: '64px 36px' }}><p className="eyebrow">CUSTOMER WORKSPACE</p><h1>Page not found</h1><p>The page you requested does not exist.</p><button type="button" className="dark-button" onClick={() => navigate('home')}>Return home</button></section>;
            case 'home':
            default:
                return (
                    <Home user={user} isAuthenticated onNavigate={navigateTo} onAuth={() => {}} onRequireAuth={() => {}} onSelectProvider={(provider) => navigateTo(`provider/${provider.id}`)} />
                );
        }
    };

    return (
        <div className="app-shell">
            <Nav activePage={activePage} onNavigate={navigate} user={user} onLogout={onLogout} />
            <div className="app-content">
                <FixitAsyncBoundary key={activePage}>
                    <div key={activePage} className="fixit-page-transition">
                        {renderPage()}
                    </div>
                </FixitAsyncBoundary>
            </div>
        </div>
    );
}

function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\\/?/, '');
    if (!hash) return 'landing';
    const route = hash.split('?')[0];
    return route === 'home' ? 'marketplace' : route;
}

const protectedRoutes = ['my-jobs', 'post-job', 'job-details', 'payment', 'review', 'account'];

function PublicExperience({ route, user, openAuth, requireAuth }) {
    const navigate = (nextRoute) => navigateTo(nextRoute);
    const match = route.match(/^provider\\/([^/]+)$/);
    if (match) return <ProviderProfile provider={providers.find((provider) => provider.id === match[1])} user={user} onNavigate={navigate} onAuth={openAuth} onRequireAuth={requireAuth} />;
    if (route === 'marketplace') return <Home user={user} isAuthenticated={Boolean(user)} onNavigate={navigate} onAuth={openAuth} onRequireAuth={requireAuth} onSelectProvider={(provider) => navigate(`provider/${provider.id}`)} />;
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
    if (user && protectedRoutes.includes(route)) return <CustomerWorkspace user={user} onLogout={onLogout} />;
    return <PublicExperience route={route} user={user} openAuth={openAuth} requireAuth={requireAuth} />;
}

export default function App() {
    return <AuthGate>{(auth) => <FixitApp {...auth} />}</AuthGate>;
}
