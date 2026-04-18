import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Button, Link, Stack, TextField } from '@mui/material'

import { useAuth } from '../../../state/auth/authContext.js'
import { AuthLayout } from './AuthLayout.jsx'

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <AuthLayout title="Create account" subtitle="Registration uses JWT in the backend; mocked for now.">
      <Stack spacing={1.5}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          helperText="Use a strong password in real deployment."
        />
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={busy}
          onClick={async () => {
            setError('')
            try {
              setBusy(true)
              await auth.register({ name, email, password })
              navigate('/app/dashboard', { replace: true })
            } catch (e) {
              setError(e.message || 'Registration failed')
            } finally {
              setBusy(false)
            }
          }}
        >
          Create account
        </Button>
        <Link component={RouterLink} to="/login">
          Already have an account? Sign in
        </Link>
      </Stack>
    </AuthLayout>
  )
}

