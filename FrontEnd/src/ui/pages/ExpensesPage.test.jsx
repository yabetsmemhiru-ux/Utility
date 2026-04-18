import React from 'react'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '../../test/renderWithProviders.jsx'
import { ExpensesPage } from './ExpensesPage.jsx'

describe('ExpensesPage', () => {
  it('renders expense list container', async () => {
    renderWithProviders(<ExpensesPage />)
    expect(await screen.findByText(/this month/i)).toBeInTheDocument()
  })
})

