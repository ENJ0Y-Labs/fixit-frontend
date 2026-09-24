import { useState } from 'react';
import Nav from './Nav';
import Home from './Home';
import PostJob from './PostJob';
import MyJobs from './MyJobs';
import JobDetails from './JobDetails';
import Payment from './Payment';
import Review from './Review';
import Account from './Account';
import Messages from './Messages';

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
    const [selectedJob, setSelectedJob] = useState(initialJobs[0]);

    const navigate = (page, job = selectedJob) => {
        if (job) setSelectedJob(job);
        setActivePage(page);
    };

    const handleCancelJob = (job) => {
        const cancelledJob = { ...job, status: 'CANCELLED', progressPercentage: 0 };
        setJobs((current) => current.map((item) => item.id === job.id ? cancelledJob : item));
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
                        onPostJob={() => navigate('postJob')}
                        onViewDetails={(job) => navigate('jobDetails', job)}
                        onOpenMessages={(job) => navigate('messages', job)}
                    />
                );
            case 'messages':
                return (
                    <Messages
                        selectedJob={selectedJobFromState}
                        onViewJob={() => navigate('jobDetails', selectedJobFromState)}
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
                        onMessages={() => navigate('messages', selectedJobFromState)}
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
            <div className="app-content">{renderPage()}</div>
        </div>
    );
}

export default App;
