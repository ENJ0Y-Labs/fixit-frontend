import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ProfilePage from './ProfilePage.jsx';

afterEach(() => {
    cleanup();
});

function fillRequiredFields() {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada Okafor' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '08012345678' } });
    fireEvent.change(screen.getByLabelText(/base area or address/i), { target: { value: 'Rumuola, Port Harcourt' } });
    fireEvent.change(screen.getByLabelText(/professional biography/i), {
        target: { value: 'Experienced home service professional with over five years of practical work.' },
    });
}

describe('provider onboarding and profile', () => {
    it('shows required-field errors and preserves entered data after validation fails', () => {
        render(<ProfilePage />);
        fireEvent.click(screen.getByRole('button', { name: /preview profile/i }));

        expect(screen.getByText('Enter your full name.')).toBeInTheDocument();
        expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toHaveValue('');
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada Okafor' } });
        fireEvent.click(screen.getByRole('button', { name: /preview profile/i }));
        expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Okafor');
        expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
    });

    it('rejects invalid email and Nigerian phone values', () => {
        render(<ProfilePage />);
        fillRequiredFields();
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'not-an-email' } });
        fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '12345' } });
        fireEvent.click(screen.getByRole('button', { name: /preview profile/i }));

        expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
        expect(screen.getByText(/valid Nigerian mobile number/i)).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('previews valid details before local confirmation and clearly states that no server save occurs', async () => {
        render(<ProfilePage />);
        fillRequiredFields();
        fireEvent.click(screen.getByRole('button', { name: /preview profile/i }));

        expect(screen.getByRole('dialog', { name: /preview your profile/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Ada Okafor' })).toBeInTheDocument();
        expect(screen.getByText('Rumuola, Port Harcourt')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /confirm preview/i }));
        expect(await screen.findByRole('status')).toHaveTextContent(/have not been sent to a server/i);
        expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Okafor');
    });

    it('rejects unsupported profile image types without losing other form data', () => {
        const { container } = render(<ProfilePage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada Okafor' } });
        const fileInput = container.querySelector('input[type="file"]');
        const file = new File(['not an image'], 'profile.gif', { type: 'image/gif' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(screen.getByText(/choose a JPG, PNG, or WebP image/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Okafor');
    });

    it('rejects profile images larger than 2 MB', () => {
        const { container } = render(<ProfilePage />);
        const fileInput = container.querySelector('input[type="file"]');
        const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });
        expect(screen.getByText(/image must be 2 MB or smaller/i)).toBeInTheDocument();
    });

    it('asks before discarding unsaved edits', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        render(<ProfilePage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Ada Okafor' } });
        fireEvent.click(screen.getByRole('button', { name: /discard changes/i }));
        expect(confirmSpy).toHaveBeenCalledOnce();
        expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Okafor');
        confirmSpy.mockRestore();
    });
});
