import { useEffect, useRef, useState } from 'react';
import './MyJobsPage.css';

const EMPTY_JOBS = [];
const groups = [
    { id: 'upcoming', label: 'Upcoming / accepted' },
    { id: 'in-progress', label: 'In progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
];

function actionLabel(value) {
    return String(value).replace(/[_-]+/g, ' ').trim();
}

function formatNaira(amount) {
    if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2,
    }).format(amount);
}

function LoadingState() {
    return (
        <section className="card my-jobs-state" aria-busy="true" aria-live="polite">
            <h2>Loading your jobs</h2>
            <p className="text-muted">Fetching the latest job statuses…</p>
            <div className="my-jobs-skeleton" aria-hidden="true"><span /><span /><span /></div>
        </section>
    );
}

function ErrorState({ onRetry }) {
    return (
        <section className="card my-jobs-state" role="alert">
            <h2>We couldn’t load your jobs</h2>
            <p className="text-muted">No job status was changed. Check your connection and refresh the latest records.</p>
            <button className="btn btn-primary" type="button" onClick={onRetry}>Try again</button>
        </section>
    );
}

function JobCard({ job, onRequestTransition, transitionPending, canTransition }) {
    const amount = formatNaira(job.agreedAmount);
    const transitions = Array.isArray(job.allowedTransitions)
        ? job.allowedTransitions.filter((transition) => typeof transition === 'string' && transition.trim())
        : [];

    return (
        <article className="card managed-job-card">
            <div className="managed-job-main">
                <div className="managed-job-heading">
                    <h3>{job.title || 'Untitled job'}</h3>
                    <span className="status-badge status-neutral" aria-label={`Job status: ${job.status}`}>
                        {job.status}
                    </span>
                </div>
                {job.location && <p className="managed-job-location">{job.location}</p>}
                {job.customerReference && <p className="managed-job-reference">Job reference: {job.customerReference}</p>}
                {job.description && <p className="managed-job-description">{job.description}</p>}
                {amount && <p className="managed-job-amount"><span>Agreed amount</span><strong>{amount}</strong></p>}
                {job.updatedAt && <p className="managed-job-updated">Last updated: {new Date(job.updatedAt).toLocaleString('en-NG')}</p>}
            </div>
            <div className="managed-job-actions">
                <p className="managed-job-actions-label">Available actions</p>
                {transitions.length === 0 ? (
                    <p className="field-hint">No status changes are currently allowed for this job.</p>
                ) : transitions.map((transition) => (
                    <button
                        className="btn btn-secondary"
                        type="button"
                        key={transition}
                        disabled={!canTransition || transitionPending}
                        onClick={() => onRequestTransition(job, transition)}
                    >
                        {transitionPending ? 'Updating…' : actionLabel(transition)}
                    </button>
                ))}
                {!canTransition && transitions.length > 0 && (
                    <p className="field-hint">Status updates are unavailable until the backend is connected.</p>
                )}
            </div>
        </article>
    );
}

export default function MyJobsPage({
    dataState = 'unconfigured',
    jobs = EMPTY_JOBS,
    onRetry = () => {},
    onTransitionJob,
}) {
    const [activeGroup, setActiveGroup] = useState('upcoming');
    const [localJobs, setLocalJobs] = useState(jobs);
    const [selectedAction, setSelectedAction] = useState(null);
    const [pendingJobId, setPendingJobId] = useState(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const transitionLock = useRef(new Set());

    useEffect(() => {
        setLocalJobs(jobs);
    }, [jobs]);

    async function confirmTransition() {
        if (!selectedAction || transitionLock.current.has(selectedAction.job.id)) return;
        if (typeof onTransitionJob !== 'function') {
            setError('Job progress is not connected to the backend. No status was changed.');
            setSelectedAction(null);
            return;
        }

        const { job, transition } = selectedAction;
        transitionLock.current.add(job.id);
        setPendingJobId(job.id);
        setError('');
        setNotice('');
        try {
            const response = await onTransitionJob(job.id, {
                transition,
                ...(job.version !== undefined ? { expectedVersion: job.version } : {}),
                ...(job.updatedAt ? { expectedUpdatedAt: job.updatedAt } : {}),
            });
            const updatedJob = response?.job ?? response;
            if (!updatedJob || updatedJob.id !== job.id
                || typeof updatedJob.status !== 'string' || !updatedJob.status.trim()) {
                setError('The server response did not confirm the updated job status. Refresh your jobs before trying again.');
                return;
            }
            setLocalJobs((current) => current.map((item) => item.id === job.id ? updatedJob : item));
            setNotice(`Job updated. Server status: ${updatedJob.status}`);
        } catch (transitionError) {
            if (transitionError?.status === 409) {
                setError('This job has changed since you loaded it. Refresh your jobs and review the latest status before trying again.');
            } else if (transitionError?.status === 401) {
                setError('Your session has expired. Sign in again before updating job progress.');
            } else if (transitionError?.status === 403) {
                setError('You are not authorized to update this job. No status was changed.');
            } else if (transitionError?.status === 422) {
                setError(transitionError?.message || 'The server rejected this status transition. Refresh the job and review the allowed actions.');
            } else {
                setError(transitionError?.message || 'We could not update this job because of a network or server error. No success was confirmed.');
            }
        } finally {
            transitionLock.current.delete(job.id);
            setPendingJobId(null);
            setSelectedAction(null);
        }
    }

    const groupJobs = (groupId) => localJobs.filter((job) => job.statusCategory === groupId);
    const visibleJobs = groupJobs(activeGroup);
    const hasUncategorised = localJobs.some((job) => !groups.some((group) => group.id === job.statusCategory));

    if (dataState === 'loading') return <LoadingState />;
    if (dataState === 'error') return <ErrorState onRetry={onRetry} />;

    if (dataState === 'unconfigured') {
        return (
            <div className="my-jobs-page">
                <div className="page-heading">
                    <div><p className="eyebrow">Job management</p><h1>My Jobs</h1><p>Track accepted work and update progress when the server permits it.</p></div>
                </div>
                <section className="card my-jobs-unconfigured" role="status">
                    <h2>Job data is not connected yet</h2>
                    <p>The screen is ready for backend job records, but this workspace has no confirmed jobs API or transition contract. No sample jobs or status changes are being presented as real.</p>
                    <p className="field-hint">The API requirements are documented in <code>MY_JOBS_API.md</code>.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="my-jobs-page">
            <div className="page-heading">
                <div><p className="eyebrow">Job management</p><h1>My Jobs</h1><p>Review the latest server status before taking action. Only server-approved transitions are shown.</p></div>
            </div>

            {error && <div className="my-jobs-alert" role="alert">{error}</div>}
            {notice && <div className="my-jobs-notice" role="status">{notice}</div>}

            <div className="my-jobs-groups" role="tablist" aria-label="Job progress categories">
                {groups.map((group) => (
                    <button
                        type="button"
                        role="tab"
                        key={group.id}
                        id={`my-jobs-tab-${group.id}`}
                        aria-selected={activeGroup === group.id}
                        aria-controls="my-jobs-panel"
                        className={`my-jobs-group-tab${activeGroup === group.id ? ' is-active' : ''}`}
                        onClick={() => setActiveGroup(group.id)}
                    >
                        <span>{group.label}</span><strong>{groupJobs(group.id).length}</strong>
                    </button>
                ))}
            </div>

            <section id="my-jobs-panel" className="my-jobs-results" role="tabpanel" aria-labelledby={`my-jobs-tab-${activeGroup}`}>
                {visibleJobs.length === 0 ? (
                    <div className="card my-jobs-empty">
                        <h2>{dataState === 'empty' || localJobs.length === 0 ? 'No jobs to show' : `No jobs in “${groups.find((group) => group.id === activeGroup)?.label}”`}</h2>
                        <p className="text-muted">This view uses the job records returned by the backend. A job will appear here when its status category matches this section.</p>
                    </div>
                ) : visibleJobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onRequestTransition={(selectedJob, transition) => {
                            setError('');
                            setNotice('');
                            setSelectedAction({ job: selectedJob, transition });
                        }}
                        transitionPending={pendingJobId === job.id}
                        canTransition={typeof onTransitionJob === 'function'}
                    />
                ))}
            </section>

            {hasUncategorised && (
                <section className="card my-jobs-unmapped" aria-labelledby="unmapped-heading">
                    <h2 id="unmapped-heading">Jobs with unmapped status categories</h2>
                    <p className="text-muted">These records are retained rather than silently placed in the wrong section. Map each server status category in the agreed API contract.</p>
                    {localJobs.filter((job) => !groups.some((group) => group.id === job.statusCategory)).map((job) => (
                        <p key={job.id}><strong>{job.title || job.id}</strong> · <span aria-label={`Job status: ${job.status}`}>{job.status}</span></p>
                    ))}
                </section>
            )}

            {selectedAction && (
                <div className="dialog-backdrop" role="presentation">
                    <section className="dialog my-jobs-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="my-jobs-confirm-heading" aria-describedby="my-jobs-confirm-description">
                        <div className="dialog-header">
                            <div><p className="eyebrow">Confirm job update</p><h2 id="my-jobs-confirm-heading">{actionLabel(selectedAction.transition)}?</h2></div>
                        </div>
                        <p id="my-jobs-confirm-description">
                            {/cancel/i.test(selectedAction.transition)
                                ? 'Cancelling may affect the customer and your job record. Continue only if this is intended.'
                                : `This will request the “${selectedAction.transition}” transition for “${selectedAction.job.title || selectedAction.job.id}”. The server must approve the change.`}
                        </p>
                        <p className="field-hint">Current server status: {selectedAction.job.status}</p>
                        <div className="dialog-footer">
                            <button className="btn btn-secondary" type="button" disabled={pendingJobId === selectedAction.job.id} onClick={() => setSelectedAction(null)}>Keep current status</button>
                            <button className="btn btn-primary" type="button" disabled={pendingJobId === selectedAction.job.id} onClick={confirmTransition}>
                                {pendingJobId === selectedAction.job.id ? 'Updating…' : 'Confirm update'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
