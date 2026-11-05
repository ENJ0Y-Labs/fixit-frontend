// Illustrative admin support and dispute cases. No live customer messages or evidence are attached.
export const demoSupportCases = [
  {
    id: 'DSP-1042', type: 'Dispute', subject: 'Work marked complete before repair was finished',
    status: 'OPEN', priority: 'High', category: 'Work quality', jobId: 'FX-2045',
    customer: 'Tunde Ekanem', customerId: 'CUS-1005', provider: 'Adaeze Nwosu', providerId: 'PRV-2084',
    createdAt: '05 Nov 2026, 09:12', updatedAt: '05 Nov 2026, 09:12', assignedTo: 'Unassigned',
    summary: 'Customer reports that the water heater installation was not completed, although the job was marked complete.',
    evidence: ['Customer description (sample)', 'Job status snapshot (sample)'],
    messages: [
      { sender: 'Customer', time: '05 Nov 2026, 09:12', body: 'The installation is not finished. The provider left before testing the heater.' },
      { sender: 'System', time: '05 Nov 2026, 09:12', body: 'A dispute was opened for job FX-2045.' },
    ],
  },
  {
    id: 'SUP-1041', type: 'Support', subject: 'Unable to update phone number',
    status: 'UNDER_REVIEW', priority: 'Normal', category: 'Account access', jobId: null,
    customer: 'Ada Nwankwo', customerId: 'CUS-1008', provider: null, providerId: null,
    createdAt: '05 Nov 2026, 08:48', updatedAt: '05 Nov 2026, 09:30', assignedTo: 'Admin team',
    summary: 'Customer says the profile form does not save a replacement phone number.',
    evidence: ['Customer description (sample)'],
    messages: [
      { sender: 'Customer', time: '05 Nov 2026, 08:48', body: 'I tried updating my phone number twice, but it still shows the old one.' },
      { sender: 'Admin team', time: '05 Nov 2026, 09:30', body: 'We are reviewing the reported profile update issue.' },
    ],
  },
  {
    id: 'DSP-1040', type: 'Dispute', subject: 'Final amount differs from initial estimate',
    status: 'WAITING_CUSTOMER', priority: 'High', category: 'Pricing', jobId: 'FX-2054',
    customer: 'Ifeoma Briggs', customerId: 'CUS-1004', provider: 'Tunde Ekanem', providerId: 'PRV-2081',
    createdAt: '04 Nov 2026, 17:05', updatedAt: '05 Nov 2026, 08:10', assignedTo: 'Admin team',
    summary: 'Customer questions an additional charge mentioned after the service began.',
    evidence: ['Customer description (sample)', 'Provider response pending'],
    messages: [
      { sender: 'Customer', time: '04 Nov 2026, 17:05', body: 'The final amount is higher than the estimate I accepted.' },
      { sender: 'Admin team', time: '05 Nov 2026, 08:10', body: 'Please share the agreed estimate or any written change to the scope.' },
    ],
  },
  {
    id: 'SUP-1039', type: 'Support', subject: 'Cannot see provider replies',
    status: 'OPEN', priority: 'Normal', category: 'Messaging', jobId: 'FX-2057',
    customer: 'Chidi Opara', customerId: 'CUS-1007', provider: null, providerId: null,
    createdAt: '04 Nov 2026, 15:22', updatedAt: '04 Nov 2026, 15:22', assignedTo: 'Unassigned',
    summary: 'Customer reports that replies to a job request are not appearing in the conversation.',
    evidence: ['Customer description (sample)'],
    messages: [{ sender: 'Customer', time: '04 Nov 2026, 15:22', body: 'I received a notification but cannot see the reply in the app.' }],
  },
  {
    id: 'DSP-1038', type: 'Dispute', subject: 'Provider did not arrive at agreed time',
    status: 'UNDER_REVIEW', priority: 'Urgent', category: 'Missed appointment', jobId: 'FX-2053',
    customer: 'Daniel Tamuno', customerId: 'CUS-1003', provider: null, providerId: null,
    createdAt: '04 Nov 2026, 12:40', updatedAt: '04 Nov 2026, 13:05', assignedTo: 'Admin team',
    summary: 'Customer says the scheduled visit was missed and no updated arrival time was provided.',
    evidence: ['Customer description (sample)', 'Appointment details unavailable in demo'],
    messages: [
      { sender: 'Customer', time: '04 Nov 2026, 12:40', body: 'The provider did not arrive for the agreed appointment.' },
      { sender: 'Admin team', time: '04 Nov 2026, 13:05', body: 'We are checking the appointment details.' },
    ],
  },
  {
    id: 'SUP-1037', type: 'Support', subject: 'Question about account verification',
    status: 'WAITING_PROVIDER', priority: 'Low', category: 'Verification', jobId: null,
    customer: null, customerId: null, provider: 'Blessing George', providerId: 'PRV-2078',
    createdAt: '03 Nov 2026, 16:18', updatedAt: '04 Nov 2026, 10:25', assignedTo: 'Admin team',
    summary: 'Provider wants clarification about the status of a submitted verification document.',
    evidence: ['Provider description (sample)', 'Document file not attached'],
    messages: [
      { sender: 'Provider', time: '03 Nov 2026, 16:18', body: 'Please clarify whether I need to submit another proof of address.' },
      { sender: 'Admin team', time: '04 Nov 2026, 10:25', body: 'We have requested confirmation of the document details.' },
    ],
  },
  {
    id: 'DSP-1036', type: 'Dispute', subject: 'Reported damage after cleaning service',
    status: 'RESOLVED', priority: 'High', category: 'Property damage', jobId: 'FX-2056',
    customer: 'Mariam Abdullahi', customerId: 'CUS-1006', provider: 'Blessing George', providerId: 'PRV-2078',
    createdAt: '02 Nov 2026, 11:35', updatedAt: '03 Nov 2026, 14:50', assignedTo: 'Admin team',
    summary: 'Customer reported a damaged item after a cleaning visit. This sample case is marked resolved.',
    evidence: ['Customer description (sample)', 'Photo evidence not attached'],
    messages: [
      { sender: 'Customer', time: '02 Nov 2026, 11:35', body: 'I noticed damage to an item after the cleaning visit.' },
      { sender: 'Admin team', time: '03 Nov 2026, 14:50', body: 'Sample resolution recorded for interface preview.' },
    ],
  },
  {
    id: 'SUP-1035', type: 'Support', subject: 'Request for help finding a service category',
    status: 'CLOSED', priority: 'Low', category: 'General enquiry', jobId: null,
    customer: 'Emeka Wali', customerId: 'CUS-1002', provider: null, providerId: null,
    createdAt: '01 Nov 2026, 10:04', updatedAt: '01 Nov 2026, 12:16', assignedTo: 'Admin team',
    summary: 'Customer asked which category to use for a residential pest-control request.',
    evidence: ['Customer description (sample)'],
    messages: [
      { sender: 'Customer', time: '01 Nov 2026, 10:04', body: 'Which category should I select for home fumigation?' },
      { sender: 'Admin team', time: '01 Nov 2026, 12:16', body: 'The Pest control category is the closest match.' },
    ],
  },
  {
    id: 'DSP-1034', type: 'Dispute', subject: 'Service scope not fully delivered',
    status: 'WAITING_PROVIDER', priority: 'Normal', category: 'Incomplete work', jobId: 'FX-2048',
    customer: 'Mariam Abdullahi', customerId: 'CUS-1006', provider: 'Tunde Ekanem', providerId: 'PRV-2081',
    createdAt: '31 Oct 2026, 17:32', updatedAt: '01 Nov 2026, 09:00', assignedTo: 'Admin team',
    summary: 'Customer says one requested ceiling fan was not installed during the visit.',
    evidence: ['Customer description (sample)', 'Provider response pending'],
    messages: [
      { sender: 'Customer', time: '31 Oct 2026, 17:32', body: 'Only one of the two fans was installed.' },
      { sender: 'Admin team', time: '01 Nov 2026, 09:00', body: 'We have requested a response from the provider.' },
    ],
  },
  {
    id: 'SUP-1033', type: 'Support', subject: 'Notification preferences question',
    status: 'RESOLVED', priority: 'Low', category: 'Notifications', jobId: null,
    customer: null, customerId: null, provider: 'Chinedu Okafor', providerId: 'PRV-2083',
    createdAt: '30 Oct 2026, 09:50', updatedAt: '30 Oct 2026, 11:15', assignedTo: 'Admin team',
    summary: 'Provider asked how to control job notification preferences.',
    evidence: ['Provider description (sample)'],
    messages: [
      { sender: 'Provider', time: '30 Oct 2026, 09:50', body: 'How can I change which job alerts I receive?' },
      { sender: 'Admin team', time: '30 Oct 2026, 11:15', body: 'Sample response provided with notification settings guidance.' },
    ],
  },
];

export const supportStatuses = [
  { value: 'OPEN', label: 'Open' },
  { value: 'UNDER_REVIEW', label: 'Under review' },
  { value: 'WAITING_CUSTOMER', label: 'Waiting for customer' },
  { value: 'WAITING_PROVIDER', label: 'Waiting for provider' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

export const supportPriorities = ['Urgent', 'High', 'Normal', 'Low'];
export const formatSupportStatus = (status) => supportStatuses.find((item) => item.value === status)?.label ?? status;
