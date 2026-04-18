import React, { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material'

import { useAuth } from '../../../state/auth/authContext.js'
import { AuthLayout } from './AuthLayout.jsx'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('demo@utility.app')
  const [password, setPassword] = useState('Demo@12345')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const redirectTo = location.state?.from || '/app/dashboard'

  return (
    <AuthLayout title="Sign in" subtitle="Use the demo account or create a new one.">
      <Stack spacing={1.5}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          helperText="Demo access is prefilled so you can review the experience quickly."
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          helperText="Use the demo credentials or sign up for a fresh workspace."
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
              await auth.login({ email, password })
              navigate(redirectTo, { replace: true })
            } catch (e) {
              setError(e.message || 'Login failed')
            } finally {
              setBusy(false)
            }
          }}
        >
          Sign in
        </Button>
        <Typography variant="body2" color="text.secondary">
          Secure sign-in uses a calmer color hierarchy so the next action is always clear.
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Link component={RouterLink} to="/register">
            Create account
          </Link>
          <Link component={RouterLink} to="/forgot-password">
            Forgot password?
          </Link>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}

