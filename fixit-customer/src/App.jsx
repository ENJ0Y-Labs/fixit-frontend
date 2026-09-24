// fixit-customer\src\App.jsx

import Nav from './Nav';
import Home from './Home';
import PostJob from './PostJob';
import MyJobs from './MyJobs';
import JobDetails from './JobDetails';
import Payment from './Payment';
import Review from './Review';
import Account from './Account';

function App() {

    // No router yet. Change activePage to preview a page.
    // Replace this with real routes when the pages are wired together.
    const showNav = false;
    const activePage = "payment";

    const pages = {
        home: <Home />,
        postJob: <PostJob />,
        myJobs: <MyJobs />,
        jobDetails: <JobDetails />,
        payment: <Payment />,
        review: <Review />,
        account: <Account />
    };

    return (
        <>
            {showNav && <Nav />}
            {pages[activePage]}
        </>
    );
}

export default App
