// Illustrative service categories for the admin workspace. Not live platform data.
export const demoCategories = [
    { id: 'CAT-001', name: 'Plumbing', slug: 'plumbing', description: 'Water supply, pipes, taps, drainage, and bathroom plumbing services.', status: 'ACTIVE', serviceCount: 8, providerCount: 42, jobCount: 126, updatedAt: '04 Nov 2026', examples: ['Pipe repair', 'Tap installation', 'Drain unblocking', 'Water heater installation'] },
    { id: 'CAT-002', name: 'Electrical', slug: 'electrical', description: 'Electrical installation, repairs, inspection, and maintenance.', status: 'ACTIVE', serviceCount: 7, providerCount: 36, jobCount: 104, updatedAt: '03 Nov 2026', examples: ['Fault diagnosis', 'Socket installation', 'Lighting installation', 'Electrical inspection'] },
    { id: 'CAT-003', name: 'Cleaning', slug: 'cleaning', description: 'Residential and commercial cleaning services.', status: 'ACTIVE', serviceCount: 6, providerCount: 58, jobCount: 182, updatedAt: '02 Nov 2026', examples: ['Deep cleaning', 'Move-in cleaning', 'Sofa cleaning', 'Post-construction cleaning'] },
    { id: 'CAT-004', name: 'AC repair', slug: 'ac-repair', description: 'Air-conditioning installation, servicing, and repairs.', status: 'ACTIVE', serviceCount: 5, providerCount: 24, jobCount: 76, updatedAt: '01 Nov 2026', examples: ['AC servicing', 'Gas refilling', 'AC installation', 'Cooling fault diagnosis'] },
    { id: 'CAT-005', name: 'Carpentry', slug: 'carpentry', description: 'Woodwork, furniture repairs, fittings, and custom installations.', status: 'ACTIVE', serviceCount: 5, providerCount: 19, jobCount: 63, updatedAt: '31 Oct 2026', examples: ['Furniture repair', 'Wardrobe installation', 'Door adjustment', 'Custom shelves'] },
    { id: 'CAT-006', name: 'Laundry', slug: 'laundry', description: 'Laundry collection, washing, ironing, and delivery.', status: 'ACTIVE', serviceCount: 4, providerCount: 21, jobCount: 91, updatedAt: '30 Oct 2026', examples: ['Wash and fold', 'Ironing', 'Dry cleaning', 'Pickup and delivery'] },
    { id: 'CAT-007', name: 'Pest control', slug: 'pest-control', description: 'Residential pest inspection and treatment services.', status: 'ACTIVE', serviceCount: 4, providerCount: 13, jobCount: 38, updatedAt: '29 Oct 2026', examples: ['Fumigation', 'Rodent control', 'Termite treatment', 'Pest inspection'] },
    { id: 'CAT-008', name: 'Glasswork', slug: 'glasswork', description: 'Glass repairs, replacement, and aluminium window services.', status: 'ACTIVE', serviceCount: 3, providerCount: 11, jobCount: 29, updatedAt: '28 Oct 2026', examples: ['Window replacement', 'Glass door repair', 'Shower screen fitting'] },
    { id: 'CAT-009', name: 'Painting', slug: 'painting', description: 'Interior and exterior painting and surface preparation.', status: 'INACTIVE', serviceCount: 3, providerCount: 9, jobCount: 17, updatedAt: '26 Oct 2026', examples: ['Interior painting', 'Exterior painting', 'Wall preparation'] },
    { id: 'CAT-010', name: 'Moving services', slug: 'moving-services', description: 'Household and office moving, packing, and furniture handling.', status: 'INACTIVE', serviceCount: 2, providerCount: 5, jobCount: 8, updatedAt: '24 Oct 2026', examples: ['House relocation', 'Office relocation'] },
];

export const categoryStatuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
];

export const formatCategoryStatus = (status) => categoryStatuses.find((item) => item.value === status)?.label ?? status;
