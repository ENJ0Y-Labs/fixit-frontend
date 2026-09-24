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

const pageComponents = {
    home: Home,
    myJobs: MyJobs,
    messages: Messages,
    postJob: PostJob,
    jobDetails: JobDetails,
    payment: Payment,
    review: Review,
    account: Account,
};

function App() {
    const [activePage, setActivePage] = useState('home');

    const Page = pageComponents[activePage] ?? Home;
    const isReview = activePage === 'review';

    return (
        <div className="app-shell">
            <Nav activePage={activePage} onNavigate={setActivePage} />
            <div className="app-content">
                <Page />
            </div>
            {isReview && null}
        </div>
    );
}

export default App;
