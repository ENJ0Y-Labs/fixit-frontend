import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import JobDetailsPageProps from './JobDetailsPageProps.jsx';

afterEach(() => cleanup());

describe('customer job photo controls', () => {
    it('adds local photo previews and explains that uploads are not connected', () => {
        const createObjectURL = vi.fn().mockReturnValue('blob:job-photo-preview');
        const revokeObjectURL = vi.fn();
        vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
        const { unmount } = render(<JobDetailsPageProps />);
        const addButton = screen.getByRole('button', { name: 'Add more job photos' });
        expect(addButton).toHaveAttribute('aria-label', 'Add more job photos');

        fireEvent.change(screen.getByLabelText('Choose job photos'), {
            target: { files: [new File(['photo'], 'repair.jpg', { type: 'image/jpeg' })] },
        });

        expect(screen.getByRole('status')).toHaveTextContent('1 photo(s) added for this session only.');
        expect(screen.getByAltText('Job photo 1')).toHaveAttribute('src', 'blob:job-photo-preview');
        expect(createObjectURL).toHaveBeenCalledOnce();

        unmount();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:job-photo-preview');
        vi.unstubAllGlobals();
    });
});
