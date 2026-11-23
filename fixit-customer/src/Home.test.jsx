import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { loadPublicProviders } from './home/publicProviders.js';
import Home from './Home.jsx';
import Footer from './Footer.jsx';

vi.mock('./home/publicProviders.js', () => ({
    loadPublicProviders: vi.fn(),
}));

beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    loadPublicProviders.mockResolvedValue({ providers: [], source: 'api', error: null });
});

describe('marketplace category browsing', () => {
    it('keeps More as the final popular category and opens the other categories', async () => {
        render(<Home onSelectProvider={vi.fn()} onNavigate={vi.fn()} onAuth={vi.fn()} onRequireAuth={vi.fn()} />);
        const popular = await screen.findByRole('heading', { name: 'Popular services' });
        expect(popular).toBeInTheDocument();

        const categoryButtons = screen.getAllByRole('button', { name: /plumbing|electrical|cleaning|carpentry|painting|more/i });
        expect(categoryButtons.map((button) => button.getAttribute('aria-label'))).toEqual([
            'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'More',
        ]);
        expect(document.querySelectorAll('.marketplace-category-list .category-symbol')).toHaveLength(6);

        fireEvent.click(screen.getByRole('button', { name: 'More' }));
        expect(screen.getByRole('heading', { name: 'All service categories' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'AC repair' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Laundry' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Pest control' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Glasswork' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Moving services' })).toBeInTheDocument();
        expect(document.querySelectorAll('.marketplace-category-grid .category-symbol')).toHaveLength(5);
    });

    it('applies a selected additional category and returns to the marketplace', async () => {
        render(<Home onSelectProvider={vi.fn()} onNavigate={vi.fn()} onAuth={vi.fn()} onRequireAuth={vi.fn()} />);
        await screen.findByRole('heading', { name: 'Popular services' });
        fireEvent.click(screen.getByRole('button', { name: 'More' }));
        fireEvent.click(screen.getByRole('button', { name: 'AC repair' }));

        expect(screen.getByRole('searchbox', { name: 'Search services' })).toHaveValue('AC repair');
        expect(screen.getByRole('heading', { name: 'Popular services' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'All service categories' })).not.toBeInTheDocument();
    });
});

describe('customer footer branding', () => {
    it('uses the official FixIt PNG logo', () => {
        render(<Footer />);
        const logo = screen.getByRole('img', { name: 'FixIt logo' });
        expect(logo).toHaveAttribute('src', '/brand/logo.png');
        expect(logo.closest('a')).toHaveAttribute('href', '#landing');
    });
});
