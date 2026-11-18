import { useState } from 'react';
import Nav from './Nav';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';
import Home from './Home.jsx';
import PostJob from './PostJob.jsx';
import MyJobs from './MyJobs.jsx';
import JobDetails from './JobDetails.jsx';
import Payment from './Payment.jsx';
import Review from './Review.jsx';
import Account from './Account.jsx';

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

function App() {
    const [activePage, setActivePage] = useState('home');
    const [jobs, setJobs] = useState(initialJobs);
    const [myJobsViewState, setMyJobsViewState] = useState({ search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' });
    const [selectedJob, setSelectedJob] = useState(initialJobs[0]);

    const navigate = (page, job = selectedJob) => {
        if (job) setSelectedJob(job);
        setActivePage(page);
    };

    const handleCancelJob = (job) => {
        const cancelledJob = { ...job, status: 'CANCELLED', progressPercentage: 0 };
        setJobs((current) => {
            const exists = current.some((item) => item.id === job.id);
            return exists
                ? current.map((item) => item.id === job.id ? cancelledJob : item)
                : [cancelledJob, ...current];
        });
        setSelectedJob(cancelledJob);
        setActivePage('myJobs');
    };

    const handleJobPosted = (job) => {
        const newJob = {
            id: `JOB-${Date.now().toString().slice(-5)}`,
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
        setSelectedJob(newJob);
        setActivePage('myJobs');
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
            case 'home':
            default:
                return (
                    <Home
                        onSelectProvider={(provider) => navigate('jobDetails', {
                            id: `PROVIDER-${provider.name}`,
                            title: provider.serviceTitle,
                            provider: provider.name,
                            category: provider.category,
                            price: provider.price,
                            status: 'IN PROGRESS',
                            priceValue: provider.price,
                            progressPercentage: 0,
                        })}
                    />
                );
        }
    };

    return (
        <div className="app-shell">
            <Nav activePage={activePage} onNavigate={navigate} />
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

export default App;
