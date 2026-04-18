import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material'

import { useAuth } from '../../../state/auth/authContext.js'
import { AuthLayout } from './AuthLayout.jsx'

export function ForgotPasswordPage() {
  const auth = useAuth()
  const [email, setEmail] = useState('demo@utility.app')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  return (
    <AuthLayout title="Password reset" subtitle="Request a token-based reset link.">
      <Stack spacing={1.5}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Button
          variant="contained"
          fullWidth
          disabled={busy}
          onClick={async () => {
            setError('')
            setToken('')
            try {
              setBusy(true)
              const res = await auth.requestPasswordReset(email)
              if (res?.token) setToken(res.token) // mock-mode convenience
            } catch (e) {
              setError(e.message || 'Request failed')
            } finally {
              setBusy(false)
            }
          }}
        >
          Send reset token
        </Button>

        {token ? (
          <Alert severity="info">
            Mock mode token: <b>{token}</b>
            <br />
            Go to{' '}
            <Link component={RouterLink} to={`/reset-password?token=${token}`}>
              Reset Password
            </Link>
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary">
            In production, this sends an email with a secure reset link.
          </Typography>
        )}

        <Link component={RouterLink} to="/login">
          Back to sign in
        </Link>
      </Stack>
    </AuthLayout>
  )
}

