import { useMemo, useState } from 'react';
import { analyticsPeriods, demoCategoryPerformance, demoJobStatuses } from './data/demoAnalytics.js';
import './AnalyticsPage.css';

const formatNumber = (value) => new Intl.NumberFormat('en-NG').format(value);
const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
}).format(value);

function getPolyline(points, key, width = 640, height = 210, maxValue) {
    const max = maxValue ?? Math.max(...points.map((point) => point[key]), 1);
    return points.map((point, index) => {
        const x = points.length === 1 ? width / 2 : 24 + (index * (width - 48)) / (points.length - 1);
        const y = height - 22 - (point[key] / max) * (height - 44);
        return `${x},${y}`;
    }).join(' ');
}

function TrendChart({ points }) {
    const maxJobs = Math.max(...points.map((point) => point.jobs), 1);
    const jobPoints = getPolyline(points, 'jobs', 640, 210, maxJobs * 1.15);
    const completedPoints = getPolyline(points, 'completed', 640, 210, maxJobs * 1.15);

    return (
        <div className="analytics-chart-wrap">
            <svg className="analytics-line-chart" viewBox="0 0 640 210" role="img" aria-label="Illustrative jobs created and completed trend">
                {[40, 82, 124, 166].map((y) => <line key={y} x1="24" x2="616" y1={y} y2={y} className="chart-grid-line" />)}
                <polyline points={jobPoints} className="chart-line chart-line-jobs" />
                <polyline points={completedPoints} className="chart-line chart-line-completed" />
                {points.map((point, index) => {
                    const x = points.length === 1 ? 320 : 24 + (index * 592) / (points.length - 1);
                    const yJobs = 188 - (point.jobs / (maxJobs * 1.15)) * 166;
                    const yCompleted = 188 - (point.completed / (maxJobs * 1.15)) * 166;
                    return <g key={point.label}><circle cx={x} cy={yJobs} r="4" className="chart-dot chart-dot-jobs" /><circle cx={x} cy={yCompleted} r="4" className="chart-dot chart-dot-completed" /></g>;
                })}
            </svg>
            <div className="chart-axis-labels">{points.map((point) => <span key={point.label}>{point.label}</span>)}</div>
        </div>
    );
}

function AnalyticsPage() {
    const [period, setPeriod] = useState('30d');
    const selected = analyticsPeriods[period];
    const totals = useMemo(() => selected.points.reduce((result, point) => ({
        jobs: result.jobs + point.jobs,
        completed: result.completed + point.completed,
        customers: result.customers + point.customers,
        providers: result.providers + point.providers,
        estimatedValue: result.estimatedValue + point.estimatedValue,
    }), { jobs: 0, completed: 0, customers: 0, providers: 0, estimatedValue: 0 }), [selected]);
    const completionRate = totals.jobs ? Math.round((totals.completed / totals.jobs) * 100) : 0;
    const maxStatus = Math.max(...demoJobStatuses.map((item) => item.count));

    return (
        <div className="analytics-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Illustrative analytics</strong> All charts and metrics use sample figures. They are not live FixIt reporting or financial records.</p>
            </div>

            <section className="page-heading analytics-heading">
                <div><p className="eyebrow">Insights and reporting</p><h1>Analytics</h1><p className="page-description">Understand marketplace activity, job outcomes, and category demand.</p></div>
                <label className="analytics-period-control"><span>Reporting period</span><select aria-label="Reporting period" value={period} onChange={(event) => setPeriod(event.target.value)}><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option></select></label>
            </section>

            <section className="analytics-kpis" aria-label={`Marketplace metrics for ${selected.label}`}>
                <article className="metric-card"><p className="metric-label">Jobs created</p><strong className="metric-value">{formatNumber(totals.jobs)}</strong><p className="metric-note">{selected.label} · sample records</p></article>
                <article className="metric-card"><p className="metric-label">Jobs completed</p><strong className="metric-value">{formatNumber(totals.completed)}</strong><p className="metric-note">{completionRate}% of sample jobs created</p></article>
                <article className="metric-card"><p className="metric-label">New customers</p><strong className="metric-value">{formatNumber(totals.customers)}</strong><p className="metric-note">Sample registrations</p></article>
                <article className="metric-card"><p className="metric-label">New providers</p><strong className="metric-value">{formatNumber(totals.providers)}</strong><p className="metric-note">Sample registrations</p></article>
            </section>

            <section className="panel analytics-trend-panel">
                <div className="panel-header"><div><h2>Job activity</h2><p>Jobs created and completed across the selected period.</p></div><span className="analytics-sample-tag">Sample trend</span></div>
                <div className="analytics-legend"><span><i className="legend-dot jobs-dot" /> Jobs created</span><span><i className="legend-dot completed-dot" /> Jobs completed</span></div>
                <TrendChart points={selected.points} />
            </section>

            <section className="analytics-lower-grid">
                <article className="panel analytics-status-panel">
                    <div className="panel-header"><div><h2>Job status breakdown</h2><p>Illustrative all-time job distribution.</p></div></div>
                    <div className="status-breakdown-list">
                        {demoJobStatuses.map((item) => (
                            <div className="status-breakdown-row" key={item.label}>
                                <div className="status-breakdown-heading"><span>{item.label}</span><strong>{formatNumber(item.count)}</strong></div>
                                <div className="status-breakdown-track" role="img" aria-label={`${item.label}: ${item.count} jobs`}><span className={item.color} style={{ width: `${(item.count / maxStatus) * 100}%` }} /></div>
                            </div>
                        ))}
                    </div>
                    <p className="analytics-footnote">Status totals are sample counts and are not affected by the reporting-period selector.</p>
                </article>

                <article className="panel analytics-category-panel">
                    <div className="panel-header"><div><h2>Top service categories</h2><p>Sample job volume by category.</p></div></div>
                    <div className="category-performance-list">
                        {demoCategoryPerformance.map((category, index) => (
                            <div className="category-performance-row" key={category.name}>
                                <div className="category-performance-heading"><span className="category-rank">{index + 1}</span><strong>{category.name}</strong><span>{formatNumber(category.jobs)} jobs</span></div>
                                <div className="category-performance-track" role="img" aria-label={`${category.name}: ${category.share}% of sample jobs`}><span style={{ width: `${category.share}%` }} /></div>
                            </div>
                        ))}
                    </div>
                    <p className="analytics-footnote">Category distribution is illustrative and independent of the selected period.</p>
                </article>
            </section>

            <section className="panel analytics-value-panel">
                <div><p className="eyebrow">Estimated job value</p><h2>{formatNaira(totals.estimatedValue)}</h2><p>Sum of illustrative customer-requested budgets for the selected period.</p></div>
                <div className="analytics-value-warning"><strong>Not revenue or payments</strong><span>This figure is not provider earnings, agreed job prices, platform revenue, or money received.</span></div>
            </section>
            <p className="analytics-disclaimer">No live analytics endpoint is connected. Figures reset to the sample dataset on refresh and must not be used for business or financial decisions.</p>
        </div>
    );
}

export default AnalyticsPage;
