import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '../../../test/renderWithProviders.jsx'
import { LoginPage } from './LoginPage.jsx'

describe('LoginPage', () => {
  it('renders demo credentials and sign in button', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error for wrong password', async () => {
    renderWithProviders(<LoginPage />)
    const [passwordInput] = screen.getAllByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(screen.getAllByRole('button', { name: /sign in/i })[0])
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
  })
})

