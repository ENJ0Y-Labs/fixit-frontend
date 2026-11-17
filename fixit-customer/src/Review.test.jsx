import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Review from './Review.jsx';

afterEach(() => cleanup());

describe('customer review dialog accessibility', () => {
    it('moves focus into the dialog, traps tab navigation, and closes on Escape', () => {
        const opener = document.createElement('button');
        opener.textContent = 'Open review';
        document.body.appendChild(opener);
        opener.focus();
        const onClose = vi.fn();

        const { unmount } = render(<Review job={{ title: 'Kitchen repair' }} onClose={onClose} onSubmit={vi.fn()} />);
        const closeButton = screen.getByRole('button', { name: 'Close review' });
        const submitButton = screen.getByRole('button', { name: 'Submit Review' });

        expect(closeButton).toHaveFocus();
        submitButton.focus();
        fireEvent.keyDown(submitButton, { key: 'Tab' });
        expect(closeButton).toHaveFocus();

        fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
        expect(submitButton).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledOnce();

        unmount();
        expect(opener).toHaveFocus();
        opener.remove();
    });
});
