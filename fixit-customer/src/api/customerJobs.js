const STATUS_ALIASES = {
    PENDING: 'AWAITING BIDS',
    OPEN: 'AWAITING BIDS',
    BIDDING: 'AWAITING BIDS',
    AWAITING_BIDS: 'AWAITING BIDS',
    ACCEPTED: 'IN PROGRESS',
    ASSIGNED: 'IN PROGRESS',
    STARTED: 'IN PROGRESS',
    IN_PROGRESS: 'IN PROGRESS',
    DONE: 'COMPLETED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    CANCELED: 'CANCELLED',
};

const CATEGORY_ICONS = {
    PLUMBING: 'fa-solid fa-faucet',
    ELECTRICAL: 'fa-solid fa-bolt',
    CLEANING: 'fa-solid fa-broom',
    CARPENTRY: 'fa-solid fa-hammer',
    PAINTING: 'fa-solid fa-paint-roller',
};

function firstValue(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== '');
}

function formatDate(value) {
    if (!value) return 'Date not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('en-NG', {
        dateStyle: 'medium',
        ...(String(value).includes('T') ? { timeStyle: 'short' } : {}),
    }).format(date);
}

export function normalizeJobStatus(value) {
    const raw = String(value || '').trim().toUpperCase().replace(/[ -]+/g, '_');
    return STATUS_ALIASES[raw] || raw.replace(/_/g, ' ') || 'STATUS UNAVAILABLE';
}

export function normalizeJob(record) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
    const provider = record.provider && typeof record.provider === 'object' ? record.provider : null;
    const categoryRecord = record.category && typeof record.category === 'object' ? record.category : null;
    const category = firstValue(categoryRecord?.name, categoryRecord?.label, record.categoryName, record.category, record.service?.category?.name, record.service?.name);
    const amount = firstValue(record.agreedPrice, record.agreed_price, record.price?.amount, record.price, record.budget, record.minBudget, record.min_budget);
    const id = firstValue(record.id, record.jobId, record.job_id);
    const status = normalizeJobStatus(firstValue(record.status, record.state));
    const providerName = firstValue(provider?.name, provider?.fullName, record.providerName, record.provider_name, record.assignedProvider?.name);
    const date = firstValue(record.scheduledAt, record.scheduled_at, record.preferredDate, record.preferred_date, record.createdAt, record.created_at, record.date);
    const actions = firstValue(record.availableActions, record.available_actions, record.actions);
    const canCancel = Array.isArray(actions) ? actions.includes('cancel') : actions && typeof actions === 'object' ? actions.cancel === true : record.canCancel === true || record.can_cancel === true;
    const paymentStatus = firstValue(record.paymentStatus, record.payment_status, record.payment?.status);
    const location = firstValue(record.serviceLocation, record.service_location, record.location?.label, record.location?.address, record.location, record.address);
    const numericAmount = amount === undefined ? null : Number(amount);
    const safeAmount = Number.isFinite(numericAmount) ? numericAmount : null;

    return {
        id: id === undefined ? '' : String(id),
        title: firstValue(record.title, record.jobTitle, record.job_title, record.serviceTitle, record.service_title) || 'Untitled job',
        description: firstValue(record.description, record.details) || '',
        category: String(category || 'OTHER').toUpperCase(),
        icon: CATEGORY_ICONS[String(category || '').toUpperCase()] || 'fa-solid fa-screwdriver-wrench',
        status,
        dateStr: formatDate(date),
        dateandtimestr: formatDate(date),
        location: typeof location === 'object' ? firstValue(location?.label, location?.address, location?.city) || 'Location not provided' : location || 'Location not provided',
        serviceLocation: typeof location === 'object' ? firstValue(location?.label, location?.address, location?.city) || 'Location not provided' : location || 'Location not provided',
        fulladdress: firstValue(record.fullAddress, record.full_address, record.address?.line1, typeof record.address === 'string' ? record.address : null) || '',
        urgency: firstValue(record.urgency, record.priority) || 'Not specified',
        priceValue: safeAmount,
        agreedprice: safeAmount,
        priceLabel: safeAmount === null ? '' : status === 'COMPLETED' ? 'PAID AMOUNT' : status === 'AWAITING BIDS' ? 'EST. BUDGET' : 'AGREED PRICE',
        minBudget: firstValue(record.minBudget, record.min_budget, safeAmount) ?? 0,
        maxBudget: firstValue(record.maxBudget, record.max_budget, safeAmount) ?? 0,
        priceSubtext: paymentStatus || '',
        paymentId: firstValue(record.paymentId, record.payment_id, record.payment?.id) || null,
        canCancel: canCancel === true,
        providerName: providerName || '',
        providerRating: provider?.ratingSummary?.average ?? provider?.rating ?? null,
        provider: provider ? {
            name: providerName || 'Assigned provider',
            title: firstValue(provider.title, provider.profession, provider.businessName, provider.business_name) || '',
            avatarurl: firstValue(provider.avatarUrl, provider.avatar_url, provider.photoUrl, provider.photo_url) || '',
            rating: firstValue(provider.ratingSummary?.average, provider.rating, 0),
            reviewcount: firstValue(provider.ratingSummary?.count, provider.reviewCount, provider.review_count, 0),
            isonline: typeof (provider.isOnline ?? provider.is_online) === 'boolean' ? (provider.isOnline ?? provider.is_online) : null,
        } : null,
        bidNo: Number(firstValue(record.bidCount, record.bid_count, record.bidsCount, record.bids_count, 0)) || 0,
        progressPercentage: Number(firstValue(record.progressPercentage, record.progress_percentage, 0)) || 0,
        photos: Array.isArray(record.photos) ? record.photos.map((photo) => typeof photo === 'string' ? photo : firstValue(photo?.url, photo?.downloadUrl, photo?.download_url)).filter(Boolean) : [],
        progresstimeline: Array.isArray(record.progressTimeline) ? record.progressTimeline : Array.isArray(record.progress_timeline) ? record.progress_timeline : [],
        raw: record,
    };
}

export function extractJobList(response) {
    const payload = response?.data ?? response;
    const items = Array.isArray(payload) ? payload : payload?.items;
    return Array.isArray(items) ? items.map(normalizeJob).filter((job) => job?.id) : [];
}

export function extractJob(response) {
    const payload = response?.data ?? response;
    const record = payload?.job ?? payload?.item ?? payload;
    return normalizeJob(record);
}

export function jobErrorMessage(error, fallback = 'We could not load your jobs. Please try again.') {
    if (error?.status === 401) return 'Your session has expired. Sign in again to view your jobs.';
    if (error?.status === 403) return 'You do not have permission to view this job.';
    if (error?.status === 404) return 'This job is unavailable or may have been removed.';
    return error?.message || fallback;
}
