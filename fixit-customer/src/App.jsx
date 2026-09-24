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

function App() {
    const [activePage, setActivePage] = useState('home');
    const [selectedJob, setSelectedJob] = useState({
        title: 'Fixing Kitchen Sink Leak',
        provider: 'Emeka Nwachukwu',
        category: 'PLUMBING',
        price: 12500,
    });

    const navigate = (page, job) => {
        if (job) setSelectedJob(job);
        setActivePage(page);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'myJobs':
                return <MyJobs onPostJob={() => navigate('postJob')} onViewDetails={(job) => navigate('jobDetails', job)} onOpenMessages={(job) => navigate('messages', job)} />;
            case 'messages':
                return <Messages selectedJob={selectedJob} onViewJob={() => navigate('jobDetails', selectedJob)} />;
            case 'postJob':
                return <PostJob />;
            case 'jobDetails':
                return <JobDetails job={selectedJob} onBack={() => navigate('myJobs')} onPayment={() => navigate('payment', selectedJob)} onMessages={() => navigate('messages', selectedJob)} />;
            case 'payment':
                return <Payment job={selectedJob} onBack={() => navigate('jobDetails', selectedJob)} onPaymentComplete={() => navigate('review', selectedJob)} />;
            case 'review':
                return <Review job={selectedJob} onClose={() => navigate('myJobs')} onSubmit={() => navigate('myJobs')} />;
            case 'account':
                return <Account />;
            case 'home':
            default:
                return <Home onSelectProvider={(provider) => navigate('jobDetails', {
                    title: 'Fixing ' + provider.job.toLowerCase(),
                    provider: provider.name,
                    category: provider.job.toUpperCase(),
                    price: provider.price,
                })} />;
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
