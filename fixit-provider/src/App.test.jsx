import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App', () => {
    it('renders the provider workspace welcome heading', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', { name: /your work starts here/i }),
        ).toBeInTheDocument();
    });
});
