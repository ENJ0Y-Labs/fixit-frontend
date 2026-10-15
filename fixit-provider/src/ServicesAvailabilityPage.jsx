import { useMemo, useState } from 'react';
import './ServicesAvailabilityPage.css';

const serviceOptions = [
    'Plumbing', 'Electrical repairs', 'Cleaning', 'Carpentry',
    'Painting', 'Air conditioning', 'Appliance repair', 'General maintenance',
];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const initialServices = [
    { id: 1, name: 'Plumbing', description: 'Tap repairs, leak detection, and basic pipe maintenance.', price: '15000', pricing: 'from' },
];
const initialSchedule = days.map((day, index) => ({
    day,
    enabled: index < 5,
    start: '09:00',
    end: '17:00',
}));


function validateServices(services) {
    const errors = {};
    const names = new Set();
    services.forEach((service) => {
        const rowErrors = {};
        if (!service.name) rowErrors.name = 'Choose a service.';
        if (names.has(service.name)) rowErrors.name = 'Each service can only be listed once.';
        names.add(service.name);
        if (!service.description.trim()) rowErrors.description = 'Add a short description.';
        if (service.pricing !== 'quote' && !service.price.trim()) rowErrors.price = 'Enter a price for this pricing option.';
        if (service.price.trim() && (!Number.isFinite(Number(service.price)) || Number(service.price) < 0)) {
            rowErrors.price = 'Enter a valid non-negative price.';
        }
        if (service.price.trim() && Number(service.price) === 0) rowErrors.price = 'Price must be greater than ₦0.';
        if (Object.keys(rowErrors).length) errors[service.id] = rowErrors;
    });
    return errors;
}

function validateSchedule(schedule) {
    const errors = {};
    schedule.forEach((item) => {
        if (!item.enabled) return;
        if (!item.start || !item.end) errors[item.day] = 'Add both a start and end time.';
        else if (item.start >= item.end) errors[item.day] = 'End time must be later than start time.';
    });
    if (!schedule.some((item) => item.enabled)) errors.general = 'Select at least one working day, or mark yourself unavailable.';
    return errors;
}

export default function ServicesAvailabilityPage({ section = 'My Services' }) {
    const [services, setServices] = useState(initialServices);
    const [savedServices, setSavedServices] = useState(initialServices);
    const [schedule, setSchedule] = useState(initialSchedule);
    const [savedSchedule, setSavedSchedule] = useState(initialSchedule);
    const [isAvailable, setIsAvailable] = useState(true);
    const [savedAvailability, setSavedAvailability] = useState(true);
    const [serviceErrors, setServiceErrors] = useState({});
    const [scheduleErrors, setScheduleErrors] = useState({});
    const [notice, setNotice] = useState('');
    const [newService, setNewService] = useState('');

    const servicesDirty = JSON.stringify(services) !== JSON.stringify(savedServices);
    const scheduleDirty = JSON.stringify(schedule) !== JSON.stringify(savedSchedule) || isAvailable !== savedAvailability;
    const isAvailabilityPage = section === 'Availability';
    const isDirty = isAvailabilityPage ? scheduleDirty : servicesDirty;

    const enabledDays = useMemo(() => schedule.filter((item) => item.enabled), [schedule]);

    function updateService(id, field, value) {
        setServices((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
        setServiceErrors((current) => ({ ...current, [id]: { ...current[id], [field]: '' } }));
        setNotice('');
    }

    function addService(event) {
        event.preventDefault();
        if (!newService) return;
        if (services.some((item) => item.name === newService)) {
            setNotice('That service is already listed.');
            return;
        }
        setServices((current) => [...current, {
            id: Math.max(0, ...current.map((item) => item.id)) + 1,
            name: newService, description: '', price: '', pricing: 'quote',
        }]);
        setNewService('');
        setNotice('');
    }

    function removeService(id) {
        setServices((current) => current.filter((item) => item.id !== id));
        setServiceErrors((current) => {
            const next = { ...current };
            delete next[id];
            return next;
        });
        setNotice('');
    }

    function saveServices(event) {
        event.preventDefault();
        const errors = validateServices(services);
        setServiceErrors(errors);
        setNotice('');
        if (Object.keys(errors).length) {
            document.getElementById('service-name-' + Object.keys(errors)[0])?.focus();
            return;
        }
        setNotice('Validation passed, but these service changes are still unsaved. This frontend demo has no backend connection.');
    }

    function updateDay(day, field, value) {
        setSchedule((current) => current.map((item) => item.day === day ? { ...item, [field]: value } : item));
        setScheduleErrors((current) => ({ ...current, [day]: '' }));
        setNotice('');
    }

    function saveSchedule(event) {
        event.preventDefault();
        const errors = isAvailable ? validateSchedule(schedule) : {};
        setScheduleErrors(errors);
        setNotice('');
        if (Object.keys(errors).length) {
            document.getElementById('availability-' + Object.keys(errors)[0])?.focus();
            return;
        }
        setNotice('Validation passed, but these availability changes are still unsaved. This frontend demo has no backend connection.');
    }

    function discardChanges() {
        if (!window.confirm('Discard your unsaved changes?')) return;
        setServices(savedServices.map((item) => ({ ...item })));
        setSchedule(savedSchedule.map((item) => ({ ...item })));
        setIsAvailable(savedAvailability);
        setServiceErrors({});
        setScheduleErrors({});
        setNotice('Unsaved changes discarded.');
    }

    return (
        <div className="services-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Provider setup</p>
                    <h1>{isAvailabilityPage ? 'Availability' : 'My Services'}</h1>
                    <p>{isAvailabilityPage ? 'Set the hours customers can request your work.' : 'Describe what you do and provide clear starting prices where possible.'}</p>
                </div>
                <span className={isDirty ? 'unsaved-indicator' : 'saved-indicator'}>{isDirty ? 'Unsaved changes' : 'No unsaved changes'}</span>
            </div>

            {notice && <p className="services-notice" role="status">{notice}</p>}

            {!isAvailabilityPage ? (
                <>
                    <section className="card services-intro">
                        <div>
                            <h2>Your service listings</h2>
                            <p>Only list work you can safely and reliably provide. Prices are optional, but if supplied they must be greater than ₦0.</p>
                        </div>
                        <span className="status-badge status-neutral">{services.length} {services.length === 1 ? 'service' : 'services'}</span>
                    </section>

                    <form className="card services-form" onSubmit={saveServices} noValidate>
                        {services.length === 0 && (
                            <div className="empty-state" role="status">
                                <h2>No services listed</h2>
                                <p>Add a service below to describe what customers can request from you.</p>
                            </div>
                        )}
                        <div className="service-list">
                            {services.map((service) => (
                                <article className="service-editor" key={service.id}>
                                    <div className="service-editor-heading">
                                        <h2>{service.name || 'New service'}</h2>
                                        <button className="btn btn-quiet service-remove" type="button" onClick={() => removeService(service.id)} aria-label={'Remove ' + (service.name || 'new service')}>Remove</button>
                                    </div>
                                    <div className="service-editor-grid">
                                        <div className="form-field">
                                            <label htmlFor={'service-name-' + service.id}>Service</label>
                                            <select id={'service-name-' + service.id} value={service.name} onChange={(event) => updateService(service.id, 'name', event.target.value)} aria-invalid={Boolean(serviceErrors[service.id]?.name)}>
                                                <option value="">Choose a service</option>
                                                {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                            </select>
                                            {serviceErrors[service.id]?.name && <p className="field-error">{serviceErrors[service.id].name}</p>}
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor={'service-pricing-' + service.id}>Pricing</label>
                                            <select id={'service-pricing-' + service.id} value={service.pricing} onChange={(event) => updateService(service.id, 'pricing', event.target.value)}>
                                                <option value="from">Starting from</option>
                                                <option value="fixed">Fixed price</option>
                                                <option value="quote">Quote after assessment</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor={'service-price-' + service.id}>Price (₦, optional)</label>
                                            <input id={'service-price-' + service.id} inputMode="decimal" type="number" min="1" step="1" placeholder="e.g. 15000" value={service.price} onChange={(event) => updateService(service.id, 'price', event.target.value)} aria-invalid={Boolean(serviceErrors[service.id]?.price)} />
                                            {serviceErrors[service.id]?.price && <p className="field-error">{serviceErrors[service.id].price}</p>}
                                        </div>
                                        <div className="form-field service-description-field">
                                            <label htmlFor={'service-description-' + service.id}>Description</label>
                                            <textarea id={'service-description-' + service.id} value={service.description} onChange={(event) => updateService(service.id, 'description', event.target.value)} placeholder="What work is included? Any limits customers should know?" aria-invalid={Boolean(serviceErrors[service.id]?.description)} />
                                            {serviceErrors[service.id]?.description && <p className="field-error">{serviceErrors[service.id].description}</p>}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="add-service-row">
                            <div className="form-field">
                                <label htmlFor="add-service">Add a permitted service</label>
                                <select id="add-service" value={newService} onChange={(event) => setNewService(event.target.value)}>
                                    <option value="">Choose a service to add</option>
                                    {serviceOptions.filter((option) => !services.some((item) => item.name === option)).map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </div>
                            <button className="btn btn-secondary" type="button" disabled={!newService} onClick={addService}>Add service</button>
                        </div>
                        <div className="services-form-actions">
                            <button className="btn btn-quiet" type="button" onClick={discardChanges} disabled={!servicesDirty}>Discard changes</button>
                            <button className="btn btn-primary" type="submit">Review and save</button>
                        </div>
                        <p className="services-demo-note">Demo only: changes stay in this page session and are not sent to a backend.</p>
                    </form>
                </>
            ) : (
                <form className="card availability-form" onSubmit={saveSchedule} noValidate>
                    <section className={'availability-status ' + (isAvailable ? 'is-available' : 'is-unavailable')}>
                        <div>
                            <h2>{isAvailable ? 'Accepting new work' : 'Unavailable for new work'}</h2>
                            <p>{isAvailable ? 'Customers can see the hours you set below.' : 'Your schedule is paused. Your saved hours are preserved until you switch availability back on.'}</p>
                        </div>
                        <label className="availability-toggle">
                            <input type="checkbox" checked={isAvailable} onChange={(event) => { setIsAvailable(event.target.checked); setNotice(''); }} />
                            <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
                        </label>
                    </section>

                    <div className="card-header availability-heading">
                        <div><h2>Weekly working hours</h2><p>Choose working days and set a start and end time. Overnight shifts are not supported.</p></div>
                    </div>
                    {!isAvailable && <p className="availability-paused" role="status">Working-hour controls are disabled while you are unavailable.</p>}
                    {scheduleErrors.general && <p className="field-error" role="alert">{scheduleErrors.general}</p>}
                    <div className="schedule-list">
                        {schedule.map((item) => (
                            <div className={'schedule-row' + (!item.enabled ? ' is-day-off' : '')} key={item.day}>
                                <label className="schedule-day">
                                    <input type="checkbox" checked={item.enabled} disabled={!isAvailable} onChange={(event) => updateDay(item.day, 'enabled', event.target.checked)} />
                                    <span>{item.day}</span>
                                </label>
                                <label className="schedule-time-field" htmlFor={'availability-' + item.day}>
                                    <span>From</span>
                                    <input id={'availability-' + item.day} type="time" value={item.start} disabled={!isAvailable || !item.enabled} onChange={(event) => updateDay(item.day, 'start', event.target.value)} aria-invalid={Boolean(scheduleErrors[item.day])} />
                                </label>
                                <label className="schedule-time-field" htmlFor={'availability-end-' + item.day}>
                                    <span>To</span>
                                    <input id={'availability-end-' + item.day} type="time" value={item.end} disabled={!isAvailable || !item.enabled} onChange={(event) => updateDay(item.day, 'end', event.target.value)} aria-invalid={Boolean(scheduleErrors[item.day])} />
                                </label>
                                <span className="schedule-summary">{!item.enabled ? 'Day off' : item.start + '–' + item.end}</span>
                                {scheduleErrors[item.day] && <p className="field-error schedule-error" role="alert">{scheduleErrors[item.day]}</p>}
                            </div>
                        ))}
                    </div>
                    <div className="availability-summary">
                        <strong>{isAvailable ? enabledDays.length + ' working days selected' : 'Availability turned off'}</strong>
                        <span>{isAvailable ? 'Hours are shown in your local time.' : 'Customers should not treat your profile as available for new requests.'}</span>
                    </div>
                    <div className="services-form-actions">
                        <button className="btn btn-quiet" type="button" onClick={discardChanges} disabled={!scheduleDirty}>Discard changes</button>
                        <button className="btn btn-primary" type="submit">Review and save</button>
                    </div>
                    <p className="services-demo-note">Demo only: changes stay in this page session and are not sent to a backend.</p>
                </form>
            )}
        </div>
    );
}
