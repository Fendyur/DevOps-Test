import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'
import { validateTitle } from './validateTitle.js'

vi.mock('./supabaseClient.js', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  },
}))

describe('App', () => {
  it('renders', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Task Tracker' })).toBeTruthy()
    expect(await screen.findByRole('button', { name: 'Log in' })).toBeTruthy()
  })
})

describe('validateTitle', () => {
  it('rejects empty task titles', () => {
    expect(validateTitle('')).toBe('Task title cannot be empty.')
    expect(validateTitle('   ')).toBe('Task title cannot be empty.')
    expect(validateTitle('Buy milk')).toBeNull()
  })
})
