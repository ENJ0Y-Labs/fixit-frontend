import { customerApi } from '../api/customer.js';
import { providers as sampleProviders } from './providers.js';

function firstText(...values) {
    return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function finiteNumber(value) {
    const number = Number(value);
    return value !== null && value !== undefined && value !== '' && Number.isFinite(number) ? number : null;
}

export function normalizePublicProvider(record) {
    if (!record || typeof record !== 'object' || record.id === undefined || record.id === null) return null;
    const rating = finiteNumber(record.rating ?? record.ratingSummary?.average);
    const reviewCount = finiteNumber(record.reviewCount ?? record.review ?? record.ratingSummary?.count);
    const hourlyRate = finiteNumber(record.hourlyRate?.amount ?? record.hourlyRate ?? record.price);
    const areas = Array.isArray(record.serviceAreas) ? record.serviceAreas : [];
    const services = Array.isArray(record.services) ? record.services : [];
    const location = firstText(record.location, record.primaryServiceArea, areas[0]?.area, areas[0]?.name, areas[0]?.city);
    const availability = firstText(record.availability?.status, record.availabilityStatus).toLowerCase();
    const verification = firstText(record.verification?.status, record.verificationStatus).toLowerCase();

    return {
        id: String(record.id),
        name: firstText(record.name, record.displayName, record.fullName) || 'Provider',
        job: firstText(record.headline, record.jobTitle, record.profession) || 'Service provider',
        category: firstText(record.category?.name, record.category, services[0]?.category?.name, services[0]?.category).toUpperCase(),
        serviceTitle: firstText(record.serviceTitle, services[0]?.name, services[0]?.title),
        description: firstText(record.bio, record.description),
        services: services.map((service) => ({
            name: firstText(service?.name, service?.title),
            description: firstText(service?.description),
        })).filter((service) => service.name || service.description),
        serviceAreas: areas.map((area) => firstText(area?.area, area?.name, area?.city, area)).filter(Boolean),
        location,
        rating,
        review: reviewCount,
        distance: finiteNumber(record.distanceKm ?? record.distance),
        price: hourlyRate,
        available: availability ? availability === 'available' : record.available === true,
        availabilityKnown: Boolean(availability) || typeof record.available === 'boolean',
        verificationStatus: verification,
        credentials: (Array.isArray(record.publicCredentials) ? record.publicCredentials : []).map((item) => firstText(item?.label, item?.name, item)).filter(Boolean),
        avatarUrl: firstText(record.avatarUrl, record.profilePhotoUrl, record.photoUrl),
        source: 'api',
    };
}

function unwrapProviderList(payload) {
    const value = payload?.data ?? payload;
    const items = Array.isArray(value) ? value : value?.items;
    if (!Array.isArray(items)) throw new Error('The public providers endpoint returned an unexpected response.');
    return items.map(normalizePublicProvider).filter(Boolean);
}

export async function loadPublicProviders() {
    try {
        const payload = await customerApi.listProviders({ limit: 50 });
        return { providers: unwrapProviderList(payload), source: 'api', error: null };
    } catch (error) {
        return {
            providers: sampleProviders.map((provider) => ({ ...provider, availabilityKnown: true, source: 'sample' })),
            source: 'sample',
            error: error?.message || 'Live provider listings are temporarily unavailable.',
        };
    }
}

function normalizePublicReviews(payload) {
    const value = payload?.data ?? payload;
    const items = Array.isArray(value) ? value : value?.items;
    if (!Array.isArray(items)) return [];
    return items.map((review) => ({
        id: review?.id === undefined || review?.id === null ? null : String(review.id),
        author: firstText(review?.author?.displayName, review?.customerDisplayName, review?.authorName),
        rating: finiteNumber(review?.rating),
        comment: firstText(review?.comment, review?.body, review?.content),
        createdAt: firstText(review?.createdAt, review?.publishedAt),
    })).filter((review) => review.author || review.comment || review.rating !== null);
}

export async function loadPublicProvider(providerId) {
    try {
        const payload = await customerApi.getProvider(providerId);
        const provider = normalizePublicProvider(payload?.data ?? payload);
        if (!provider) return { provider: null, source: 'unavailable', error: 'The provider profile response was incomplete.' };
        let reviews = [];
        let reviewsError = null;
        try {
            reviews = normalizePublicReviews(await customerApi.listProviderReviews(providerId, { limit: 10 }));
        } catch (error) {
            reviewsError = error?.message || 'Public reviews are temporarily unavailable.';
        }
        return { provider: { ...provider, reviews }, source: 'api', error: null, reviewsError };
    } catch (error) {
        const provider = sampleProviders.find((item) => item.id === providerId);
        return {
            provider: provider ? { ...provider, source: 'sample', credentials: [], reviews: [] } : null,
            source: provider ? 'sample' : 'unavailable',
            error: error?.message || 'This provider profile is temporarily unavailable.',
        };
    }
}
