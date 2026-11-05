// Illustrative verification cases. These records and document references are not real submissions.
export const demoVerificationCases = [
    {
        id: 'VER-1048', providerId: 'PRV-2084', provider: 'Adaeze Nwosu', business: 'Nwosu Plumbing Services',
        service: 'Plumbing', submitted: '04 Nov 2026', status: 'Pending review', location: 'GRA Phase 2, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'trade-certificate-sample.pdf', status: 'Missing', note: 'No sample certificate supplied.' },
        ],
    },
    {
        id: 'VER-1047', providerId: 'PRV-2083', provider: 'Chinedu Okafor', business: 'CO Electrical Works',
        service: 'Electrical', submitted: '03 Nov 2026', status: 'Pending review', location: 'Rumuola, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'utility-bill-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'trade-certificate-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
        ],
    },
    {
        id: 'VER-1046', providerId: 'PRV-2082', provider: 'Mariam Danjuma', business: 'FreshSpace Cleaning',
        service: 'Cleaning', submitted: '02 Nov 2026', status: 'Needs information', location: 'Woji, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Needs replacement', note: 'Illustrative review note: document details are unreadable.' },
            { name: 'Professional certificate', fileName: 'not-required-sample.txt', status: 'Not required', note: 'No certification requirement is represented in this sample.' },
        ],
    },
    {
        id: 'VER-1045', providerId: 'PRV-2081', provider: 'Tunde Ekanem', business: 'CoolPoint AC Services',
        service: 'AC repair', submitted: '01 Nov 2026', status: 'Pending review', location: 'Trans Amadi, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'trade-certificate-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
        ],
    },
    {
        id: 'VER-1044', providerId: 'PRV-2080', provider: 'Ifeoma Briggs', business: 'Briggs Home Repairs',
        service: 'Carpentry', submitted: '30 Oct 2026', status: 'Approved', location: 'Old GRA, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'trade-certificate-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
        ],
    },
    {
        id: 'VER-1043', providerId: 'PRV-2079', provider: 'Daniel Tamuno', business: 'Tamuno Pest Control',
        service: 'Pest control', submitted: '29 Oct 2026', status: 'Rejected', location: 'Eliozu, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'trade-certificate-sample.pdf', status: 'Missing', note: 'Sample review note: required evidence was not provided.' },
        ],
    },
    {
        id: 'VER-1042', providerId: 'PRV-2078', provider: 'Blessing George', business: 'BrightWash Laundry',
        service: 'Laundry', submitted: '27 Oct 2026', status: 'Pending review', location: 'Ada George, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Professional certificate', fileName: 'not-required-sample.txt', status: 'Not required', note: 'No certification requirement is represented in this sample.' },
        ],
    },
    {
        id: 'VER-1041', providerId: 'PRV-2077', provider: 'Emeka Wali', business: 'Wali Glass & Aluminium',
        service: 'Glasswork', submitted: '25 Oct 2026', status: 'Needs information', location: 'Rumuokoro, Port Harcourt',
        documents: [
            { name: 'Government-issued ID', fileName: 'identity-document-sample.pdf', status: 'Submitted', note: 'Sample metadata only. No file is attached.' },
            { name: 'Proof of address', fileName: 'proof-of-address-sample.pdf', status: 'Missing', note: 'Sample review note: address evidence is outstanding.' },
            { name: 'Professional certificate', fileName: 'not-required-sample.txt', status: 'Not required', note: 'No certification requirement is represented in this sample.' },
        ],
    },
];
