export function formatNaira(amount) {
    const value = Number(amount);
    if (!Number.isFinite(value)) return 'Not available';
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

export function calculateEarnings(records = []) {
    return records.reduce((totals, record) => {
        const amount = Number(record.amount);
        if (!Number.isFinite(amount) || amount < 0) return totals;
        if (['estimated', 'agreed', 'paid'].includes(record.amountType)) totals[record.amountType] += amount;
        return totals;
    }, { estimated: 0, agreed: 0, paid: 0 });
}
