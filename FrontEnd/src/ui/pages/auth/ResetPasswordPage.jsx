import React, { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Button, Link, Stack, TextField } from '@mui/material'

import { useAuth } from '../../../state/auth/authContext.js'
import { AuthLayout } from './AuthLayout.jsx'

export function ResetPasswordPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const presetToken = params.get('token') || ''
  const [token, setToken] = useState(presetToken)
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const canSubmit = useMemo(() => token && newPassword.length >= 8, [token, newPassword])

  return (
    <AuthLayout title="Set new password" subtitle="Verify token and choose a new password.">
      <Stack spacing={1.5}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {done ? <Alert severity="success">Password updated. You can sign in now.</Alert> : null}
        <TextField label="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
        <TextField
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          helperText="Minimum 8 characters (mock UI check)."
        />
        <Button
          variant="contained"
          fullWidth
          disabled={busy || !canSubmit}
          onClick={async () => {
            setError('')
            try {
              setBusy(true)
              await auth.resetPassword({ token, newPassword })
              setDone(true)
              setTimeout(() => navigate('/login', { replace: true }), 600)
            } catch (e) {
              setError(e.message || 'Reset failed')
            } finally {
              setBusy(false)
            }
          }}
        >
          Update password
        </Button>
        <Link component={RouterLink} to="/login">
          Back to sign in
        </Link>
      </Stack>
    </AuthLayout>
  )
}

