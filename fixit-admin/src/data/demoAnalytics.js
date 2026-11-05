// Illustrative analytics only. Replace with API-backed aggregates when the reporting contract is approved.
export const analyticsPeriods = {
    '7d': {
        label: 'Last 7 days',
        points: [
            { label: 'Mon', jobs: 18, completed: 9, customers: 7, providers: 2, estimatedValue: 245000 },
            { label: 'Tue', jobs: 22, completed: 13, customers: 8, providers: 3, estimatedValue: 318000 },
            { label: 'Wed', jobs: 16, completed: 10, customers: 5, providers: 1, estimatedValue: 226000 },
            { label: 'Thu', jobs: 27, completed: 17, customers: 11, providers: 4, estimatedValue: 402000 },
            { label: 'Fri', jobs: 31, completed: 19, customers: 12, providers: 3, estimatedValue: 478000 },
            { label: 'Sat', jobs: 35, completed: 22, customers: 14, providers: 5, estimatedValue: 536000 },
            { label: 'Sun', jobs: 24, completed: 15, customers: 9, providers: 2, estimatedValue: 351000 },
        ],
    },
    '30d': {
        label: 'Last 30 days',
        points: [
            { label: 'Week 1', jobs: 104, completed: 62, customers: 39, providers: 12, estimatedValue: 1480000 },
            { label: 'Week 2', jobs: 126, completed: 79, customers: 45, providers: 15, estimatedValue: 1870000 },
            { label: 'Week 3', jobs: 118, completed: 73, customers: 42, providers: 13, estimatedValue: 1720000 },
            { label: 'Week 4', jobs: 143, completed: 91, customers: 54, providers: 17, estimatedValue: 2180000 },
        ],
    },
    '90d': {
        label: 'Last 90 days',
        points: [
            { label: 'Aug', jobs: 382, completed: 231, customers: 142, providers: 43, estimatedValue: 5480000 },
            { label: 'Sep', jobs: 416, completed: 258, customers: 158, providers: 49, estimatedValue: 6120000 },
            { label: 'Oct', jobs: 491, completed: 305, customers: 186, providers: 56, estimatedValue: 7340000 },
        ],
    },
};

export const demoJobStatuses = [
    { label: 'Awaiting bids', count: 148, color: 'status-awaiting' },
    { label: 'In progress', count: 96, color: 'status-progress' },
    { label: 'Completed', count: 624, color: 'status-completed' },
    { label: 'Cancelled', count: 52, color: 'status-cancelled' },
];

export const demoCategoryPerformance = [
    { name: 'Cleaning', jobs: 182, share: 22 },
    { name: 'Plumbing', jobs: 126, share: 15 },
    { name: 'Electrical', jobs: 104, share: 13 },
    { name: 'Laundry', jobs: 91, share: 11 },
    { name: 'AC repair', jobs: 76, share: 9 },
];
